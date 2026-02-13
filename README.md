# Dev Notes MCP Server

This project is a simple (MCP) server built for Claude Code. It is a note‑taking system that allows Claude to save, list, and read markdown notes stored locally on your machine. The server includes three tools: `save_note`, `list_notes`, and `read_note`,. Each tool handles one job: saving new notes, listing all the notes in the folder, and reading them back to you so Claude can use that information as context to help you use prompts more efficiently.
## Installation

1. Clone or download this repository.
2. Run `npm install` to install dependencies.
3. Add the server to Claude Code using:
claude mcp add --transport stdio dev-notes -- node /full/path/to/index.js

## Example Usage

1. Save a note: save_note with title and content as parameters.
2. List all notes: list_notes to see every file in a directory.
3. Read a note: read_note with a title to load the contents and have Claude read it back to you.

