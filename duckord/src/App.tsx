import "./App.css";
import {createSignal} from "solid-js";
import {invoke} from "@tauri-apps/api/core";

async function postRequest(
    url: string,
    headers?: Record<string, string>,
    body?: string
) {
    const response = await invoke<{
        status: number;
        body: string;
    }>('post_request', {
        args: {
            url,
            headers,
            body,
        },
    });
    return response;
}

export default function App() {
    const [text, setText] = createSignal("")

    const auth = import.meta.env.VITE_DISCORD_TOKEN;
    const channelID = import.meta.env.VITE_CHANNEL_ID;

    async function sendMessage(e: Event) {
        e.preventDefault();
        try {
            await postRequest(
                `https://discord.com/api/v10/channels/${channelID}/messages`,
                {
                    Authorization: auth,
                    "Content-Type": "application/json",
                },
                JSON.stringify({ content: text().trim() })
            );

            setText("");
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <>
            <div class={"justify-center items-center flex flex-col h-screen"}>
                <form onSubmit={sendMessage}>
                    <fieldset class={"fieldset"}>
                            <legend class={"fieldset-legend"}>Your message</legend>
                            <textarea class={"textarea textarea-xl h-48 focus:outline-none focus:ring-0"}
                                  placeholder={"Type your message here..."} value={text()}
                                  onInput={(e) => setText(e.currentTarget.value)}
                            />
                    </fieldset>
                    <button type={"submit"} class={"btn btn-primary w-full mt-2"}>Send</button>
                </form>
            </div>
        </>
    )
}