import asyncio
import json
import os
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client

async def main():
    server_params = StdioServerParameters(
        command="python",
        args=["-m", "notebooklm_tools.mcp.server", "--transport", "stdio"],
        env=os.environ.copy()
    )
    
    async with stdio_client(server_params) as (read, write):
        async with ClientSession(read, write) as session:
            await session.initialize()
            
            result = await session.call_tool("notebook_list", {"max_results": 10})
            data = json.loads(result.content[0].text)
            for nb in data.get("notebooks", []):
                print(f"ID: {nb['id']} | Title: {nb['title']}")

if __name__ == "__main__":
    asyncio.run(main())
