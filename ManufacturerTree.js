import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

// Function to collapse all nodes except the root
const collapseAllNodes = (node) => {
  if (node.children) {
    node._children = node.children;
    node.children.forEach(collapseAllNodes);
    node.children = null;
  }
};

const transformData = (node) => {
  if (!node.children || node.children.length === 0) {
    return { ...node, displayName: node.manufacturer.split(",")[0] };
  }
  const transformedChildren = node.children.map((child) => transformData(child));
  const mostProbable = node.children.reduce(
    (max, curr) => (curr.percentage > max.percentage ? curr : max),
    node.children[0]
  );
  return {
    ...node,
    displayName: mostProbable.manufacturer.split(",")[0],
    children: transformedChildren,
  };
};

const ManufacturerTree = ({ initialData }) => {
  const svgRef = useRef(null);
  const [popup, setPopup] = useState({ visible: false, x: 0, y: 0, content: "" });
  const [data, setData] = useState(() => {
    const rootNode = transformData(JSON.parse(JSON.stringify(initialData)));
    collapseAllNodes(rootNode);
    return rootNode;
  });

  const toggleNode = (node) => {
    if (node.children) {
      node._children = node.children;
      node.children = null;
    } else {
      node.children = node._children;
      node._children = null;
    }
    setData({ ...data });
  };

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .style("background", "#f3f6f9")
      .style("font-family", "sans-serif");

    const treeLayout = d3.tree().size([height, width - 200]);
    const root = d3.hierarchy(data);
    treeLayout(root);

    svg.selectAll(".link").remove();
    svg.selectAll(".node").remove();

    svg.selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("class", "link")
      .attr("fill", "none")
      .attr("stroke", "#aaa")
      .attr("stroke-width", 2)
      .attr("d", d3.linkHorizontal().x(d => d.y).y(d => d.x));

    const nodes = svg.selectAll(".node")
      .data(root.descendants())
      .join("g")
      .attr("class", "node")
      .attr("transform", d => `translate(${d.y},${d.x})`)
      .on("click", (event, d) => toggleNode(d.data))
      .on("mouseover", (event, d) => {
        setPopup({ visible: true, x: event.pageX + 15, y: event.pageY - 15, content: `Component: ${d.data.name}` });
      })
      .on("mousemove", (event) => {
        setPopup(prev => ({ ...prev, x: event.pageX + 15, y: event.pageY - 15 }));
      })
      .on("mouseout", () => {
        setPopup({ visible: false, x: 0, y: 0, content: "" });
      });

    nodes.append("circle")
      .attr("r", 10)
      .attr("fill", d => ["#69b3a2", "#ffcc00", "#ff5733", "#87cefa", "#6a0dad"][d.depth] || "#ccc")
      .attr("stroke", "#333")
      .attr("stroke-width", 2);

      nodes
      .append("text")
      .attr("dy", "0.35em")
      .attr("x", 15)
      .attr("text-anchor", "start")
      .style("font-size", "18px")
      .style("fill", "#333")
      .each(function (d) {
        const words = d.data.displayName.split(" ");
        const lineHeight = 1.2; // Adjust line height if needed
        const maxWordsPerLine = Math.ceil(words.length / 2); // Split into two lines
        const firstLine = words.slice(0, maxWordsPerLine).join(" ");
        const secondLine = words.slice(maxWordsPerLine).join(" ");
    
        d3.select(this)
          .append("tspan")
          .attr("x", 15)
          .attr("dy", "0.6em")
          .text(firstLine);
    
        if (secondLine) {
          d3.select(this)
            .append("tspan")
            .attr("x", 15)
            .attr("dy", `${lineHeight}em`)
            .text(secondLine);
        }
      });

    return () => svg.selectAll("*").remove();
  }, [data]);

  return (
    <>
      <svg ref={svgRef} style={{ width: "100%", height: "70vh" }}></svg>
      {popup.visible && (
        <div
          style={{
            position: "absolute",
            top: popup.y,
            left: popup.x,
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "5px",
            padding: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            pointerEvents: "none",
            zIndex: 1000,
          }}
        >
          <strong>Component:</strong>
          <div>{popup.content}</div>
        </div>
      )}
    </>
  );
};

export default ManufacturerTree;