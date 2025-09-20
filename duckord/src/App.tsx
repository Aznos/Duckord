import "./App.css";
import {createSignal} from "solid-js";

export default function App() {
    const [text, setText] = createSignal("")

    return (
        <>
            <div class={"justify-center items-center flex flex-col h-screen"}>
                <form method={"post"}>
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