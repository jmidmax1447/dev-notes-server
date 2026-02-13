// Dev Notes MCP Server
// ====================
// A simple MCP (Model Context Protocol) server that lets Claude Code
// save, list, and read markdown notes in your ~/dev-notes/ folder.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import fs from "fs/promises";
import path from "path";
import os from "os";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

// All notes live in ~/dev-notes/
const NOTES_DIR = path.join(os.homedir(), "dev-notes");

// ---------------------------------------------------------------------------
// Helper functions
// ---------------------------------------------------------------------------

// Turn a human-readable title into a safe filename
// e.g. "Project Ideas" → "project-ideas"
function slugify(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-") // replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, "");     // trim leading/trailing hyphens
}

// Make sure the ~/dev-notes/ directory exists (creates it if not)
async function ensureNotesDir() {
  await fs.mkdir(NOTES_DIR, { recursive: true });
}

// ---------------------------------------------------------------------------
// Create the MCP server
// ---------------------------------------------------------------------------

// McpServer is the main class from the SDK — it handles the MCP protocol
// so you only need to register your tools.
const server = new McpServer({
  name: "dev-notes",       // shows up in Claude Code's tool list
  version: "1.0.0",
});

// ---------------------------------------------------------------------------
// Tool 1: save_note
// ---------------------------------------------------------------------------
// Saves a markdown file to ~/dev-notes/<slugified-title>.md

server.tool(
  "save_note",                              // tool name
  "Save a markdown note to ~/dev-notes/",   // description shown to Claude
  {
    // Input schema — the SDK uses Zod for validation
    title: z.string().describe("The note title (used as filename)"),
    content: z.string().describe("The markdown content of the note"),
  },
  async ({ title, content }) => {
    await ensureNotesDir();

    const slug = slugify(title);
    const filePath = path.join(NOTES_DIR, `${slug}.md`);

    // Write the file (overwrites if it already exists)
    await fs.writeFile(filePath, content, "utf-8");

    return {
      content: [
        {
          type: "text",
          text: `Saved note "${title}" to ${filePath}`,
        },
      ],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool 2: list_notes
// ---------------------------------------------------------------------------
// Returns all .md files in ~/dev-notes/ with their last-modified dates.

server.tool(
  "list_notes",
  "List all saved notes in ~/dev-notes/",
  {},  // no parameters
  async () => {
    await ensureNotesDir();

    // Read the directory contents
    const files = await fs.readdir(NOTES_DIR);

    // Filter to only .md files
    const mdFiles = files.filter((f) => f.endsWith(".md"));

    if (mdFiles.length === 0) {
      return {
        content: [{ type: "text", text: "No notes found in ~/dev-notes/" }],
      };
    }

    // Get file stats (for last-modified date) for each note
    const notes = await Promise.all(
      mdFiles.map(async (filename) => {
        const filePath = path.join(NOTES_DIR, filename);
        const stats = await fs.stat(filePath);
        return {
          title: filename.replace(/\.md$/, ""),  // strip .md extension
          filename,
          lastModified: stats.mtime.toISOString(),
        };
      })
    );

    // Format as a readable list
    const listing = notes
      .map((n) => `- ${n.title} (${n.filename}) — modified ${n.lastModified}`)
      .join("\n");

    return {
      content: [{ type: "text", text: listing }],
    };
  }
);

// ---------------------------------------------------------------------------
// Tool 3: read_note
// ---------------------------------------------------------------------------
// Reads a note by title. Slugifies the title to find the matching file.

server.tool(
  "read_note",
  "Read a note from ~/dev-notes/ by title",
  {
    title: z.string().describe("The note title to look up"),
  },
  async ({ title }) => {
    await ensureNotesDir();

    const slug = slugify(title);
    const filePath = path.join(NOTES_DIR, `${slug}.md`);

    try {
      const content = await fs.readFile(filePath, "utf-8");
      return {
        content: [{ type: "text", text: content }],
      };
    } catch (err) {
      // File not found — return a friendly error message
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: `Note "${title}" not found (looked for ${filePath})`,
          },
        ],
      };
    }
  }
);

// ---------------------------------------------------------------------------
// Start the server
// ---------------------------------------------------------------------------

// StdioServerTransport connects the server to stdin/stdout, which is how
// Claude Code communicates with MCP servers.
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  // Use stderr for logging — stdout is reserved for MCP protocol messages
  console.error("Dev Notes MCP server running on stdio");
}

main();
