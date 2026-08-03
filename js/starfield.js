const starfield = document.getElementById('starfield');
if (!starfield) {
    const div = document.createElement('div');
    div.id = 'starfield';
    document.body.insertBefore(div, document.body.firstChild);
}
const container = document.getElementById('starfield');
const starCount = 180;
for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.classList.add('star');
    const size = Math.random() * 2.5 + 0.8;
    star.style.width = size + 'px';
    star.style.height = size + 'px';
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = Math.random() * 6 + 's';
    star.style.animationDuration = (Math.random() * 3 + 3) + 's';
    const hue = Math.random() > 0.7 ? 260 : 220;
    const lightness = Math.random() * 40 + 60;
    star.style.background = `hsl(${hue}, 80%, ${lightness}%)`;
    star.style.boxShadow = `0 0 ${size * 3}px hsl(${hue}, 90%, 70%)`;
    container.appendChild(star);
}
