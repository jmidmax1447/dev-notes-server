## What I Built

For this assignment, I followed the tutorial to create a simple MCP server called Dev Notes, which allows Claude Code to save, list, and read files stored in a directory. I decided to build this server specifically to help me grasp the concept of what an MCP server is and how it works, and with the extra context provided in the tutorial, I think I have a better understanding now. The server uses three tools — save_note, list_notes, and read_note — and utilizes Node.js to handle these tasks. Overall, building this helped me see how Claude Code utilizes these MCP servers to provide additional context when building applications, and having the ability to read files and reference them while utilizing prompts seems to be extremely beneficial for maximizing efficiency in code and token usage.

## How Claude Code Helped

Claude Code helped immensely when it came to getting the server to function properly. I did all the initial setup of the directories and the initial npm install for the package.json, even though Claude could have done it for me. However, when it came to writing the code and testing if the server was functional and the tools worked, Claude did all of that for me while I just had to set the path correctly. Some prompts I used to test the MCP server are as follows.

    Prompt 1. Create a simple MCP server for Claude Code using Node.js.                 
                                                                            
    The server should have three tools:                                       
                                                                            
        1. "save_note" - Takes a title (string) and content (string), saves the   
        content as a markdown file in ~/dev-notes/ using the title as the      
        filename (slugified, e.g. "Project Ideas" → "project-ideas.md").       
        Creates the ~/dev-notes/ directory if it doesn't exist.                
                                                                            
        2. "list_notes" - Takes no parameters, returns a list of all .md files    
        in ~/dev-notes/ with their titles and last-modified dates.             
                                                                            
        3. "read_note" - Takes a title (string), finds the matching .md file in   
        ~/dev-notes/, and returns its contents.                                
                                                                            
        Please create:                                                            
                                                                                    
        1. package.json with the @modelcontextprotocol/sdk dependency             
        2. index.js with the complete server code using McpServer and             
        StdioServerTransport                                                      
        3. Add clear comments explaining what each part does                      
                                                                                    
        Keep it simple - this is my first MCP server.

    Prompt 2. Run the MCP server (node index.js) inside the dev-notes-server folder.    
                                                                            
    If any errors occur, read the error message, fix the code in index.js or  
    package.json, and try running it again until the server starts cleanly.   
                                                                                
    Explain what you changed after each fix.

    Prompt 3. Test the three tools created and make sure they function properly. Notify me of any errors if you come across them.

## Debugging Journey

My biggest struggle was setting up the connection to the MCP server. The server itself ran cleanly, but getting Claude Code to recognize it required the correct absolute path and a few restarts. I initially ran the command and inputted the correct path to the server, but upon restarting, /mcp showed no connections to any servers. I exited Claude and tried again and still came up with no connections the second time. I then re‑entered the command to establish the connection with the same path, started Claude, and ran /mcp, and it finally showed a connection. I can only assume that I got the path wrong the first time, and when I entered it again, it worked because the path was correct.

## How MCP Works

From my understanding, MCP servers allow Claude Code to use tools that it normally wouldn’t have access to. They let an AI agent work with extra context by giving it abilities like reading and writing files or calling APIs to pull in information that Claude can reference when generating prompts or performing tasks. The architecture is set up so that if Claude doesn’t have access to certain information you ask for, it can call a tool from an MCP server, and that tool sends the information back to Claude so it can give you the answer you’re looking for.

## What I’d Do Differently
Next time, if I were to create another MCP server of similar functionality, I would make sure the path is correct when connecting and possibly add more tools to allow Claude Code to have access to more functionality, maybe updating notes or deleting notes from a given directory.
