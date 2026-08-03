const list = document.getElementById("list");
const msgTemplate = document.querySelector("#message");
const twitchID = "466878210";
let emotes7tv = {};

function hasBadge(user, keyword) {
    const links = [
        user.PlatformRoleBadgeLink,
        user.PlatformSubscriberBadgeLink,
        user.PlatformSpecialtyBadgeLink
    ];
    return links.some(link => link && link.toLowerCase().includes(keyword));
}

function isSubscriberOrVIP(user) {
    return hasBadge(user, "vip") ||
           hasBadge(user, "subscriber") ||
           hasBadge(user, "sub");
}

// Cargar Emotes de 7TV
async function load7TVEmotes() {
    try {
        const response = await fetch(`https://7tv.io/v3/users/twitch/${twitchID}`);
        const data = await response.json();
        if (data.emote_set && data.emote_set.emotes) {
            data.emote_set.emotes.forEach(emote => {
                emotes7tv[emote.name] = `https://cdn.7tv.app/emote/${emote.id}/2x.webp`;
            });
        }
    } catch (e) { 
        console.error("7TV Error:", e); 
    }
}

load7TVEmotes();

function add(data) {
    let clone = msgTemplate.content.cloneNode(true);

    // Configurar Usuario
    const userSpan = clone.querySelector(".username");
    userSpan.textContent = data.User.DisplayName;
    userSpan.style.setProperty('--user-color', data.User.Color || "#9b84ff");
    userSpan.setAttribute('data-name', data.User.DisplayName);

    if (isSubscriberOrVIP(data.User)) {
        userSpan.classList.add("username-special");
    } else {
        userSpan.classList.add("username-normal");
    }

    // Añadir Badges
    const badgesBox = clone.querySelector(".badges");
    const badgeLinks = [
        data.User.PlatformRoleBadgeLink,
        data.User.PlatformSubscriberBadgeLink,
        data.User.PlatformSpecialtyBadgeLink
    ];

    badgeLinks.forEach(link => {
        if (link) {
            let b = document.createElement("img");
            b.src = link;
            b.className = "badge-icon";
            badgesBox.appendChild(b);
        }
    });

    // Procesar Contenido del Mensaje
    const content = clone.querySelector(".text-content");
    data.Message.forEach(part => {
        if (part.Type === "Text") {
            const words = part.Content.split(" ");
            words.forEach(word => {
                if (emotes7tv[word]) {
                    let img = document.createElement("img");
                    img.src = emotes7tv[word];
                    img.className = "emote-img";
                    content.appendChild(img);
                } else {
                    content.appendChild(document.createTextNode(word));
                }
                content.appendChild(document.createTextNode(" "));
            });
        } else {
            let img = document.createElement("img");
            img.src = part.Content;
            img.className = "emote-img";
            content.appendChild(img);
            content.appendChild(document.createTextNode(" "));
        }
    });

    // Inyectar en el DOM
    const container = document.createElement("div");
    container.id = data.MessageID;
    container.appendChild(clone);
    list.appendChild(container);

    // Mostrar siempre un único mensaje (el más reciente)
    while (list.childElementCount > 1) {
        list.removeChild(list.firstChild);
    }
}

function remove(data) { 
    document.getElementById(data.MessageID)?.remove(); 
}

function clear() { 
    list.innerHTML = ""; 
}