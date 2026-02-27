import asyncio
from mcp import ClientSession, StdioServerParameters
from mcp.client.stdio import stdio_client
import sys

async def main():
    server_params = StdioServerParameters(
        command="python",
        args=["-m", "notebooklm_tools.mcp.server", "--transport", "stdio"],
    )

    try:
        async with stdio_client(server_params) as (read, write):
            async with ClientSession(read, write) as session:
                await session.initialize()
                print("--- AVAILABLE TOOLS ---")
                tools = await session.list_tools()
                for tool in tools.tools:
                    print(f"Tool Name: {tool.name}")
                    print(f"Description: {tool.description}")
                    print(f"Input Schema: {tool.inputSchema}")
                    print("----------------------")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    asyncio.run(main())
