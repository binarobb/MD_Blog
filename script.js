document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.createElement('canvas');
    canvas.id = 'star-field';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    document.body.prepend(canvas);

    const ctx = canvas.getContext('2d');
    let stars = [];

    // Deterministic pseudo-random so stars stay in the same spots on resize
    function rand(seed) {
        const x = Math.sin(seed + 1) * 10000;
        return x - Math.floor(x);
    }

    function buildStars() {
        stars = [];
        const w = canvas.width;
        const h = canvas.height;
        for (let i = 0; i < 130; i++) {
            const rx = rand(i * 3);
            const ry = rand(i * 3 + 1);
            const rz = rand(i * 3 + 2);
            stars.push({
                x: rx * w,
                y: ry * h,
                r: i % 9 === 0 ? 1.5 : 1,
                baseAlpha: 0.25 + rz * 0.4,   // range 0.25–0.65
                phase: rz * Math.PI * 2,
                freq: 0.3 + rz * 0.5           // twinkle speed in rad/s
            });
        }
    }

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        buildStars();
    }

    function draw(ts) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const t = ts * 0.001; // convert to seconds
        stars.forEach(function (s) {
            const a = s.baseAlpha + Math.sin(s.phase + t * s.freq) * 0.12;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(215, 235, 255, ' + a + ')';
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    requestAnimationFrame(draw);
});
