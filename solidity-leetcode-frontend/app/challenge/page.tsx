'use client';
import Editor from "@monaco-editor/react";
import { useState } from "react";

export default function Challenge() {
  const [code, setCode] = useState(`
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Solution {
    function twoSum(uint[] calldata nums, uint target)
        external
        pure
        returns (uint, uint)
    {
        revert("Not implemented");
    }
}
`);

  const [result, setResult] = useState("");

  async function submit() {
    const res = await fetch("http://localhost:3001/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const data = await res.json();
    setResult(data.output);
  }

  return (
    <div>
      <h2>Two Sum (Solidity)</h2>

      <Editor
        height="400px"
        language="solidity"
        value={code}
        onChange={(value) => setCode(value || "")}
      />

      <button onClick={submit}>Submit</button>

      <pre>{result}</pre>
    </div>
  );
}
