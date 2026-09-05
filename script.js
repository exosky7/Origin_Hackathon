const API_URL = "http://127.0.0.1:8000";

const USERS = {
    "1234": {
        pin: "1234",
        name: "Aisha",
        chats: [],
        activeChatId: null
    },

    "5678": {
        pin: "5678",
        name: "Rohan",
        chats: [],
        activeChatId: null
    },

    "0420": {
        pin: "0420",
        name: "Meera",
        chats: [],
        activeChatId: null
    }
};

let state = {
    currentPin: null,
    currentView: "chat",
    viewingChatId: null,
    sidebarOpen: false,
    infoTab: "terms",
    demoChoice: null
};

function getUser() {
    return USERS[state.currentPin];
}


function getActiveChat() {
    const user = getUser();

    if (!user) return null;

    return user.chats.find(
        chat => chat.id === user.activeChatId
    );
}


function getViewingChat() {
    const user = getUser();

    if (!user) return null;

    if (state.viewingChatId) {
        return user.chats.find(
            chat => chat.id === state.viewingChatId
        );
    }

    return getActiveChat();
}

function showAlert(message) {

    const overlay = document.createElement("div");

    overlay.className = "confirm-overlay";

    overlay.innerHTML = `
        <div class="confirm-box">

            <p>${message}</p>

            <div class="confirm-actions">
                <button class="primary" id="alertOkBtn">
                    OK
                </button>
            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    document
        .getElementById("alertOkBtn")
        .addEventListener("click", () => {
            overlay.remove();
        });
}


function showConfirm(message, onConfirm) {

    const overlay = document.createElement("div");

    overlay.className = "confirm-overlay";

    overlay.innerHTML = `
        <div class="confirm-box">

            <p>${message}</p>

            <div class="confirm-actions">

                <button id="confirmCancelBtn">
                    Cancel
                </button>

                <button class="danger" id="confirmOkBtn">
                    Delete
                </button>

            </div>

        </div>
    `;

    document.body.appendChild(overlay);

    document
        .getElementById("confirmCancelBtn")
        .addEventListener("click", () => {
            overlay.remove();
        });

    document
        .getElementById("confirmOkBtn")
        .addEventListener("click", () => {

            overlay.remove();

            onConfirm();
        });
}

const loginScreen = document.getElementById("loginScreen");
const appShell = document.getElementById("appShell");
const pinInput = document.getElementById("pinInput");
const loginError = document.getElementById("loginError");


function attemptLogin() {

    const pin = pinInput.value.trim();

    if (pin.length !== 4) {

        loginError.textContent =
            "PIN must be 4 digits.";

        return;
    }


    const user = USERS[pin];


    if (!user) {

        loginError.textContent =
            "PIN not recognized.";

        return;
    }


    loginError.textContent = "";

    state.currentPin = pin;


    // Create a new chat
    const chat = {

        id: "c" + Date.now(),

        createdAt: new Date(),

        pinned: false,

        messages: [

            {
                role: "bot",
                type: "text",
                text:
                    "Hi — I'm the settlement tracer. Enter a transaction ID or ask me a question about your payment."
            }

        ]
    };


    user.chats.push(chat);

    user.activeChatId = chat.id;


    state.currentView = "chat";

    state.viewingChatId = null;


    pinInput.value = "";


    loginScreen.style.display = "none";

    appShell.style.display = "flex";


    render();
}


function backToLogin() {

    state.currentPin = null;

    state.currentView = "chat";

    state.viewingChatId = null;

    state.sidebarOpen = false;


    appShell.style.display = "none";

    loginScreen.style.display = "flex";
}


document
    .getElementById("loginBtn")
    .addEventListener("click", attemptLogin);


pinInput.addEventListener("keydown", e => {

    if (e.key === "Enter") {
        attemptLogin();
    }

});


pinInput.addEventListener("input", () => {

    pinInput.value =
        pinInput.value.replace(/\D/g, "");

});

const menuBtn =
    document.getElementById("menuBtn");

const sidebar =
    document.getElementById("sidebar");

const overlay =
    document.getElementById("overlay");


function toggleSidebar(open) {

    state.sidebarOpen = open;

    sidebar.classList.toggle("open", open);

    overlay.classList.toggle("show", open);
}


menuBtn.addEventListener("click", () => {

    toggleSidebar(!state.sidebarOpen);

});


overlay.addEventListener("click", () => {

    toggleSidebar(false);

});


document
    .querySelectorAll(".nav-item")
    .forEach(btn => {

        btn.addEventListener("click", () => {

            state.currentView =
                btn.dataset.view;

            state.viewingChatId = null;

            state.demoChoice = null;

            toggleSidebar(false);

            render();

        });

    });


const mainContent =
    document.getElementById("mainContent");

const viewTitle =
    document.getElementById("viewTitle");

const userLabel =
    document.getElementById("userLabel");


const VIEW_TITLES = {

    chat: "Chat",

    transactions: "Past Transactions",

    info: "Info",

    demo: "Demo",

    history: "Previous Chats",

    accounts: "Accounts"

};

function render() {

    const user = getUser();


    userLabel.textContent =
        user ? user.name : "";


    viewTitle.textContent =
        VIEW_TITLES[state.currentView];


    document
        .querySelectorAll(".nav-item")
        .forEach(btn => {

            btn.classList.toggle(
                "active",
                btn.dataset.view === state.currentView
            );

        });


    mainContent.innerHTML = "";


    const wrap =
        document.createElement("div");


    wrap.className = "view-wrap";


    if (state.currentView === "chat") {

        wrap.appendChild(
            renderChatView()
        );

    }


    if (state.currentView === "transactions") {

        wrap.appendChild(
            renderTransactionsView()
        );

    }


    if (state.currentView === "info") {

        wrap.appendChild(
            renderInfoView()
        );

    }


    if (state.currentView === "demo") {

        wrap.appendChild(
            renderDemoView()
        );

    }


    if (state.currentView === "history") {

        wrap.appendChild(
            renderHistoryView()
        );

    }


    if (state.currentView === "accounts") {

        wrap.appendChild(
            renderAccountsView()
        );

    }


    mainContent.appendChild(wrap);
}


function renderChatView() {

    const container =
        document.createElement("div");


    const user = getUser();

    const chat = getViewingChat();


    if (!chat) {

        container.textContent =
            "No active chat.";

        return container;
    }


    const isActive =
        chat.id === user.activeChatId;


    if (!isActive) {

        const banner =
            document.createElement("div");


        banner.className =
            "readonly-banner";


        banner.textContent =
            "🔒 This chat is closed. You are viewing it in read-only mode.";


        container.appendChild(banner);
    }


    const thread =
        document.createElement("div");


    thread.className = "thread";


    chat.messages.forEach(message => {

        thread.appendChild(
            renderMessage(message)
        );

    });


    container.appendChild(thread);


    if (isActive) {

        const footer =
            document.createElement("div");


        footer.className =
            "chat-footer";


        const guidance =
            document.createElement("div");


        guidance.className =
            "chat-guidance";


        guidance.innerHTML = `
            Ask about a transaction or enter a transaction ID.
            Example: <code>TXN1003</code>
        `;


        footer.appendChild(guidance);


        const row =
            document.createElement("div");


        row.className =
            "input-row";


        row.innerHTML = `
            <input
                id="txnInput"
                type="text"
                placeholder="Ask about a transaction..."
            />

            <button id="traceBtn">
                Send
            </button>
        `;


        footer.appendChild(row);


        container.appendChild(footer);

        setTimeout(() => {

            const inputEl =
                document.getElementById("txnInput");

            const btnEl =
                document.getElementById("traceBtn");


            if (!inputEl || !btnEl) return;


            const submit = () => {

                const message =
                    inputEl.value.trim();


                if (!message) return;


                sendMessage(message);

            };


            btnEl.addEventListener(
                "click",
                submit
            );


            inputEl.addEventListener(
                "keydown",
                e => {

                    if (e.key === "Enter") {

                        submit();

                    }

                }
            );


            inputEl.focus();

        }, 0);
    }


    return container;
}

function renderMessage(message) {

    const wrap =
        document.createElement("div");


    wrap.className =
        `msg ${message.role}`;



    if (message.type === "text") {

        const bubble =
            document.createElement("div");


        bubble.className =
            "bubble";


        bubble.textContent =
            message.text;


        wrap.appendChild(bubble);


        return wrap;
    }


    if (message.type === "typing") {

        wrap.classList.add("typing");


        const bubble =
            document.createElement("div");


        bubble.className =
            "bubble";


        bubble.textContent =
            "tracing across gateway / bank / ledger…";


        wrap.appendChild(bubble);


        return wrap;
    }


    return wrap;
}


async function sendMessage(message) {

    const chat =
        getActiveChat();


    if (!chat) return;


    const inputEl =
        document.getElementById("txnInput");

    const btnEl =
        document.getElementById("traceBtn");


    // Disable UI
    if (inputEl) {
        inputEl.disabled = true;
    }


    if (btnEl) {
        btnEl.disabled = true;
        btnEl.textContent = "Sending...";
    }

    chat.messages.push({

        role: "user",

        type: "text",

        text: message

    });


    chat.messages.push({

        role: "bot",

        type: "typing"

    });


    render();


    try {

        console.log(
            "Sending to backend:",
            message
        );


        const response =
            await fetch(
                `${API_URL}/api/submit`,
                {

                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        prompt: message

                    })

                }
            );


        if (!response.ok) {

            throw new Error(
                `Server returned ${response.status}`
            );

        }


        const data =
            await response.json();


        console.log(
            "Backend response:",
            data
        );

        chat.messages.pop();

        chat.messages.push({

            role: "bot",

            type: "text",

            text:
                data.reply ||
                "The backend returned an empty response."

        });


    } catch (error) {

        console.error(
            "Backend request failed:",
            error
        );


        chat.messages.pop();


        chat.messages.push({

            role: "bot",

            type: "text",

            text:
                "I couldn't connect to the settlement server. Make sure the Python backend is running on port 8000."

        });

    }


    render();
}


// ============================================================
// PAST TRANSACTIONS
// ============================================================
//
// NOTE:
// This section is currently frontend/demo data.
// Once your Python backend exposes a transaction endpoint,
// we can replace this with real SQL data.
//

function renderTransactionsView() {

    const container =
        document.createElement("div");


    const note =
        document.createElement("div");


    note.className =
        "txn-list-note";


    note.textContent =
        "Transaction history will be loaded from the backend.";


    container.appendChild(note);


    return container;
}


// ============================================================
// INFO
// ============================================================

function renderInfoView() {

    const container =
        document.createElement("div");


    const terms = [

        {
            term: "Gateway",

            def:
                "The system that first receives and processes a payment when a customer pays."
        },

        {
            term: "Bank Settlement",

            def:
                "The step where the bank actually transfers the money after the gateway approves it."
        },

        {
            term: "Ledger",

            def:
                "Our internal record that tracks whether the money has been credited to the account."
        },

        {
            term: "Settled",

            def:
                "The payment went through completely, start to finish."
        },

        {
            term: "Pending",

            def:
                "The payment is still moving through the process — not lost, just not finished yet."
        },

        {
            term: "Failed",

            def:
                "The payment did not go through at all."
        },

        {
            term: "Needs Review",

            def:
                "There isn't enough information to explain what happened, so a person has to check manually."
        }
    ];


    const dl =
        document.createElement("dl");


    terms.forEach(term => {

        const item =
            document.createElement("div");


        item.className =
            "term-item";


        const dt =
            document.createElement("dt");


        dt.textContent =
            term.term;


        const dd =
            document.createElement("dd");


        dd.textContent =
            term.def;


        item.appendChild(dt);

        item.appendChild(dd);


        dl.appendChild(item);

    });


    container.appendChild(dl);


    return container;
}


// ============================================================
// DEMO
// ============================================================

function renderDemoView() {

    const container =
        document.createElement("div");


    if (state.demoChoice === "video") {

        const back =
            document.createElement("button");


        back.className =
            "back-link";


        back.textContent =
            "← back";


        back.addEventListener(
            "click",
            () => {

                state.demoChoice = null;

                render();

            }
        );


        container.appendChild(back);


        const video =
            document.createElement("video");


        video.controls = true;


        video.innerHTML = `
            <source
                src="demo-video.mp4"
                type="video/mp4"
            >

            Your browser can't play this video.
        `;


        container.appendChild(video);


        const note =
            document.createElement("div");


        note.className =
            "video-note";


        note.textContent =
            "Place a file named demo-video.mp4 next to this HTML file to have your recording play here.";


        container.appendChild(note);


        return container;
    }


    const q =
        document.createElement("p");


    q.style.fontSize = "14px";

    q.style.marginBottom = "16px";


    q.textContent =
        "How would you like to see the chatbot in action?";


    container.appendChild(q);


    const grid =
        document.createElement("div");


    grid.className =
        "demo-choice-grid";


    const videoCard =
        document.createElement("div");


    videoCard.className =
        "demo-choice-card";


    videoCard.innerHTML = `
        <div class="icon">🎥</div>

        <div class="label">
            Watch a Recording
        </div>

        <div class="desc">
            See a walkthrough without touching anything.
        </div>
    `;


    videoCard.addEventListener(
        "click",
        () => {

            state.demoChoice = "video";

            render();

        }
    );


    const handsCard =
        document.createElement("div");


    handsCard.className =
        "demo-choice-card";


    handsCard.innerHTML = `
        <div class="icon">🖱️</div>

        <div class="label">
            Try It Yourself
        </div>

        <div class="desc">
            Jump into the chat and talk to the AI live.
        </div>
    `;


    handsCard.addEventListener(
        "click",
        () => {

            state.currentView = "chat";

            state.viewingChatId = null;

            state.demoChoice = null;

            render();

        }
    );


    grid.appendChild(videoCard);

    grid.appendChild(handsCard);


    container.appendChild(grid);


    return container;
}


// ============================================================
// CHAT HISTORY
// ============================================================

function renderHistoryView() {

    const container =
        document.createElement("div");


    const user =
        getUser();


    const sorted =
        [...user.chats].sort(
            (a, b) => {

                if (a.pinned !== b.pinned) {

                    return a.pinned ? -1 : 1;

                }

                return b.createdAt - a.createdAt;

            }
        );


    if (sorted.length === 0) {

        const empty =
            document.createElement("div");


        empty.className =
            "empty-note";


        empty.textContent =
            "No chats yet.";


        container.appendChild(empty);


        return container;
    }


    sorted.forEach(chat => {

        const isActive =
            chat.id === user.activeChatId;


        const item =
            document.createElement("div");


        item.className =
            "history-item";


        const preview =
            chat.messages

                .filter(
                    m =>
                        m.type === "text" &&
                        m.role === "user"
                )

                .map(m => m.text)

                .join(", ")

                || "No questions yet";


        const meta =
            document.createElement("div");


        meta.className =
            "meta";


        const date =
            document.createElement("div");


        date.className =
            "date";


        date.textContent =
            chat.createdAt.toLocaleString();


        const previewEl =
            document.createElement("div");


        previewEl.className =
            "preview";


        previewEl.textContent =
            preview;


        meta.appendChild(date);

        meta.appendChild(previewEl);


        const tag =
            document.createElement("span");


        tag.className =
            "badge-tag";


        tag.textContent =
            isActive ? "active" : "closed";


        const viewBtn =
            document.createElement("button");


        viewBtn.className =
            "icon-btn";


        viewBtn.textContent =
            "👁";


        viewBtn.title =
            "View";


        viewBtn.addEventListener(
            "click",
            () => {

                state.viewingChatId =
                    chat.id;

                state.currentView =
                    "chat";

                render();

            }
        );


        const pinBtn =
            document.createElement("button");


        pinBtn.className =
            "icon-btn" +
            (chat.pinned ? " pinned" : "");


        pinBtn.textContent =
            "📌";


        pinBtn.title =
            chat.pinned
                ? "Unpin"
                : "Pin";


        pinBtn.addEventListener(
            "click",
            () => {

                chat.pinned =
                    !chat.pinned;

                render();

            }
        );


        const delBtn =
            document.createElement("button");


        delBtn.className =
            "icon-btn";


        delBtn.textContent =
            "🗑";


        delBtn.title =
            "Delete";


        delBtn.addEventListener(
            "click",
            () => {

                if (isActive) {

                    showAlert(
                        "You can't delete your current chat."
                    );

                    return;
                }


                showConfirm(
                    "Delete this chat? This cannot be undone.",
                    () => {

                        user.chats =
                            user.chats.filter(
                                c =>
                                    c.id !== chat.id
                            );


                        if (
                            state.viewingChatId ===
                            chat.id
                        ) {

                            state.viewingChatId =
                                null;

                        }


                        render();

                    }
                );

            }
        );


        item.appendChild(meta);

        item.appendChild(tag);

        item.appendChild(viewBtn);

        item.appendChild(pinBtn);

        item.appendChild(delBtn);


        container.appendChild(item);

    });


    return container;
}


// ============================================================
// ACCOUNTS
// ============================================================

function renderAccountsView() {

    const container =
        document.createElement("div");


    const user =
        getUser();


    const card =
        document.createElement("div");


    card.className =
        "account-card";


    const name =
        document.createElement("div");


    name.className =
        "name";


    name.textContent =
        user.name;


    const pin =
        document.createElement("div");


    pin.className =
        "pin-masked";


    pin.textContent =
        `PIN •••${user.pin.slice(-1)}`;


    card.appendChild(name);

    card.appendChild(pin);


    container.appendChild(card);


    const logoutBtn =
        document.createElement("button");


    logoutBtn.className =
        "full-btn danger";


    logoutBtn.textContent =
        "Logout";


    logoutBtn.addEventListener(
        "click",
        backToLogin
    );


    const switchBtn =
        document.createElement("button");


    switchBtn.className =
        "full-btn";


    switchBtn.textContent =
        "Login with Another Account";


    switchBtn.addEventListener(
        "click",
        backToLogin
    );


    container.appendChild(logoutBtn);

    container.appendChild(switchBtn);


    return container;
}