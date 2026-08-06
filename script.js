document.addEventListener('DOMContentLoaded', () => {

    /* ---------------------------------------------------
       Always open at the top (show the cover on every refresh)
       --------------------------------------------------- */
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    window.addEventListener('load', () => window.scrollTo(0, 0));
    window.addEventListener('pageshow', () => window.scrollTo(0, 0));

    /* ---------------------------------------------------
       Wedding event constants
       --------------------------------------------------- */
    const WEDDING = {
        // 2026-10-25 18:00 Asia/Taipei
        target: new Date('2026-10-25T18:00:00+08:00'),
        title: '翔鴻 & 晏瑜 婚禮',
        desc: '翔鴻 & 晏瑜 的婚禮\\n\\n入場 17:30 · 婚宴 18:00–22:00\\n\\n地點：台北晶華酒店 3樓\\n地址：台北市中山區中山北路二段39巷3號',
        location: '台北晶華酒店, 台北市中山區中山北路二段39巷3號',
        start: '20261025T180000',
        end: '20261025T220000'
    };

    /* ---------------------------------------------------
       Cover — lacquer gatefold
       --------------------------------------------------- */
    const cover = document.getElementById('cover');
    const coverSeal = document.getElementById('coverSeal');
    const bgm = document.getElementById('bgm');
    const musicBtn = document.getElementById('musicBtn');
    const icOn = musicBtn.querySelector('.ic-on');
    const icOff = musicBtn.querySelector('.ic-off');
    let playing = false;

    document.body.classList.add('lock');

    function setMusicUI(on) {
        playing = on;
        musicBtn.classList.toggle('playing', on);
        icOn.style.display = on ? 'block' : 'none';
        icOff.style.display = on ? 'none' : 'block';
    }

    function fadeIn(target = 0.55) {
        bgm.volume = 0;
        bgm.play().then(() => {
            setMusicUI(true);
            let v = 0;
            const t = setInterval(() => {
                v += 0.04;
                if (v >= target) { v = target; clearInterval(t); }
                bgm.volume = v;
            }, 160);
        }).catch(() => {/* autoplay blocked; user can tap the music button */});
    }

    if (coverSeal && cover) {
        coverSeal.addEventListener('click', () => {
            if (cover.classList.contains('open')) return;
            cover.classList.add('open');
            document.body.classList.remove('lock');
            fadeIn();
            setTimeout(() => cover.classList.add('gone'), 1500);
        });
    }

    musicBtn.addEventListener('click', () => {
        if (playing) { bgm.pause(); setMusicUI(false); }
        else { bgm.play().then(() => setMusicUI(true)).catch(() => {}); }
    });

    /* ---------------------------------------------------
       Nav — solid on scroll + mobile toggle + active link
       --------------------------------------------------- */
    const nav = document.getElementById('nav');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    const onScroll = () => {
        nav.classList.toggle('solid', window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    navToggle.addEventListener('click', () => {
        const open = navMenu.classList.toggle('open');
        navToggle.classList.toggle('active', open);
        document.body.classList.toggle('lock', open);
        document.body.classList.toggle('nav-open', open);
    });
    const closeMenu = () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('open');
        document.body.classList.remove('lock');
        document.body.classList.remove('nav-open');
    };
    navMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
    const menuClose = document.getElementById('menuClose');
    if (menuClose) menuClose.addEventListener('click', closeMenu);

    /* ---------------------------------------------------
       Countdown
       --------------------------------------------------- */
    const cdD = document.getElementById('cdD');
    const cdH = document.getElementById('cdH');
    const cdM = document.getElementById('cdM');
    const cdS = document.getElementById('cdS');
    const cdNote = document.getElementById('cdNote');
    const pad = n => String(n).padStart(2, '0');

    function tickCountdown() {
        const diff = WEDDING.target.getTime() - Date.now();
        if (diff <= 0) {
            cdD.textContent = cdH.textContent = cdM.textContent = cdS.textContent = '0';
            if (cdNote) cdNote.textContent = '今天，是我們的大喜之日 ♥';
            clearInterval(cdTimer);
            return;
        }
        const d = Math.floor(diff / 86400000);
        const h = Math.floor(diff % 86400000 / 3600000);
        const m = Math.floor(diff % 3600000 / 60000);
        const s = Math.floor(diff % 60000 / 1000);
        cdD.textContent = d;
        cdH.textContent = pad(h);
        cdM.textContent = pad(m);
        cdS.textContent = pad(s);
    }
    tickCountdown();
    const cdTimer = setInterval(tickCountdown, 1000);

    /* ---------------------------------------------------
       Gallery lightbox
       --------------------------------------------------- */
    const items = Array.from(document.querySelectorAll('.g-item'));
    const lightbox = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbCap = document.getElementById('lbCap');
    const lbCount = document.getElementById('lbCount');
    let idx = 0;

    function showLb(i) {
        idx = (i + items.length) % items.length;
        const el = items[idx];
        lbImg.src = el.dataset.full;
        const cap = el.dataset.cap || '';
        const line = el.dataset.line || '';
        lbCap.innerHTML = `<span class="lb-title">${cap}</span>` + (line ? `<span class="lb-line">${line}</span>` : '');
        lbCount.textContent = `${idx + 1} / ${items.length}`;
    }
    function openLb(i) {
        showLb(i);
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        document.body.classList.add('lock');
    }
    function closeLb() {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('lock');
    }

    items.forEach((el, i) => el.addEventListener('click', () => openLb(i)));
    document.getElementById('lbClose').addEventListener('click', closeLb);
    document.getElementById('lbPrev').addEventListener('click', () => showLb(idx - 1));
    document.getElementById('lbNext').addEventListener('click', () => showLb(idx + 1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLb(); });
    document.addEventListener('keydown', e => {
        if (!lightbox.classList.contains('open')) return;
        if (e.key === 'Escape') closeLb();
        if (e.key === 'ArrowLeft') showLb(idx - 1);
        if (e.key === 'ArrowRight') showLb(idx + 1);
    });
    // swipe
    let sx = 0;
    lbImg.addEventListener('touchstart', e => sx = e.changedTouches[0].screenX, { passive: true });
    lbImg.addEventListener('touchend', e => {
        const dx = sx - e.changedTouches[0].screenX;
        if (Math.abs(dx) > 50) showLb(idx + (dx > 0 ? 1 : -1));
    }, { passive: true });

    /* ---------------------------------------------------
       Gallery — mobile "flip through photos" deck (polaroid stack)
       --------------------------------------------------- */
    const deckStage = document.getElementById('deckStage');
    const deckDots = document.getElementById('deckDots');
    const deckPrev = document.getElementById('deckPrev');
    const deckNext = document.getElementById('deckNext');
    const photos = items.map(f => {
        const im = f.querySelector('img');
        return {
            full: f.dataset.full,
            cap: (f.dataset.cap || '').split('·')[0].trim(),
            thumb: im.getAttribute('src'),
            w: im.getAttribute('width') || '',
            h: im.getAttribute('height') || ''
        };
    });

    if (deckStage && photos.length) {
        const deckRoot = document.getElementById('deck');
        let cur = 0;
        // slight scatter so the stack looks like a real pile of prints
        const tilt = [-2, 2.5, -3.5, 1.5, -1];

        const cards = photos.map((p, i) => {
            const card = document.createElement('div');
            card.className = 'deck-card';
            // reserve orientation up-front (from known dimensions) so nothing reflows on load
            card.classList.add(Number(p.h) > Number(p.w) ? 'port' : 'land');
            card.innerHTML =
                `<div class="photo"><img src="${p.thumb}" width="${p.w}" height="${p.h}" draggable="false" alt=""></div>` +
                `<div class="polaroid-cap">${p.cap}</div>`;
            deckStage.appendChild(card);
            const dot = document.createElement('i');
            deckDots.appendChild(dot);
            return card;
        });

        // base transform keeps the card centered (left/top 50%) then offsets for the stack
        function baseTransform(pos) {
            const t = tilt[pos % tilt.length];
            if (pos === 0) return `translate(-50%, -50%) rotate(-1deg)`;
            const dx = (pos % 2 ? 1 : -1) * (6 + pos * 3);
            const dy = 6 + pos * 4;
            return `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) rotate(${t}deg) scale(${1 - pos * 0.03})`;
        }
        function layout() {
            const len = photos.length;
            cards.forEach((card, i) => {
                const pos = (i - cur + len) % len;
                card.classList.toggle('is-top', pos === 0);
                if (pos > 3) {
                    card.style.opacity = '0'; card.style.zIndex = '0'; card.style.pointerEvents = 'none';
                    card.style.transform = baseTransform(3); return;
                }
                card.style.opacity = pos <= 2 ? '1' : '.5';
                card.style.zIndex = String(len - pos);
                card.style.pointerEvents = pos === 0 ? 'auto' : 'none';
                card.style.transform = baseTransform(pos);
            });
            Array.from(deckDots.children).forEach((d, i) => d.classList.toggle('on', i === cur));
        }

        // ---- swipe: press anywhere on the top card, drag it, fling to advance ----
        let dragCard = null, sX = 0, sY = 0, dX = 0, moved = false, flinging = false;
        function onMove(e) {
            if (!dragCard) return;
            dX = e.clientX - sX;
            const dY = e.clientY - sY;
            if (!moved && Math.abs(dX) + Math.abs(dY) > 5) moved = true;
            if (!moved) return;
            dragCard.style.transform =
                `translate(calc(-50% + ${dX}px), calc(-50% + ${dY * 0.25}px)) rotate(${dX / 24}deg)`;
        }
        function endDrag(e) {
            const card = dragCard; dragCard = null;
            if (!card) return;
            card.removeEventListener('pointermove', onMove);
            card.removeEventListener('pointerup', endDrag);
            card.removeEventListener('pointercancel', endDrag);
            try { card.releasePointerCapture(e.pointerId); } catch (_) {}
            card.classList.remove('dragging');
            if (!moved) { openLb(cur); return; }
            if (Math.abs(dX) > 55) fling(card, dX < 0 ? -1 : 1);
            else layout();                       // spring back to the top of the stack
        }
        // Kill the browser's native image drag-and-drop. Without this, pressing on
        // a photo (an <img>) starts a ghost-image drag that hijacks the gesture, so
        // the photo won't swipe while the plain-div frame around it still does —
        // the exact "can only drag on the border" symptom. draggable="false" on the
        // img covers most browsers; this is the belt-and-suspenders for the rest.
        deckStage.addEventListener('dragstart', e => e.preventDefault());

        // Press ANYWHERE on the top card — image included — and that card captures
        // the pointer, so every move/up belongs to it no matter what's under the
        // finger. Same technique Framer Motion uses in the shop-swipe reference.
        deckStage.addEventListener('pointerdown', e => {
            if (flinging || deckRoot.classList.contains('deck-ended')) return;
            if (!e.target.closest('.deck-card')) return;   // only when the press lands on a card
            const card = cards[cur];
            dragCard = card;
            sX = e.clientX; sY = e.clientY; dX = 0; moved = false;
            card.classList.add('dragging');
            try { card.setPointerCapture(e.pointerId); } catch (_) {}
            card.addEventListener('pointermove', onMove);
            card.addEventListener('pointerup', endDrag);
            card.addEventListener('pointercancel', endDrag);
        });

        function fling(card, dir) {
            if (flinging) return;
            flinging = true;
            const len = photos.length;
            const atEnd = cur === len - 1;   // last photo, swiped either direction → story ends
            const throwX = dir < 0 ? -(window.innerWidth) : window.innerWidth;
            card.style.transform =
                `translate(calc(-50% + ${throwX}px), calc(-50% - 30px)) rotate(${dir < 0 ? -20 : 20}deg)`;
            card.style.opacity = '0';
            setTimeout(() => {                    // advance on a timer (no fragile transitionend)
                flinging = false;
                if (atEnd) { showEnd(); return; }
                cur = (cur + 1) % len;
                card.style.transition = 'none';
                layout();
                void card.offsetWidth;
                card.style.transition = '';
            }, 330);
        }

        // ---- story-end screen: scattered photos + a replay button ----
        const deckEnd = document.createElement('div');
        deckEnd.className = 'deck-end';
        const scatter = document.createElement('div');
        scatter.className = 'de-scatter';
        const cols = 4, rows = Math.ceil(photos.length / cols);
        photos.forEach((p, i) => {
            const c = i % cols, r = Math.floor(i / cols);
            const jx = ((i * 53) % 22) - 11, jy = ((i * 31) % 22) - 11;
            const mini = document.createElement('div');
            mini.className = 'de-mini';
            mini.style.left = ((c + 0.5) / cols * 100 + jx * 0.5) + '%';
            mini.style.top = ((r + 0.5) / rows * 100 + jy * 0.5) + '%';
            mini.style.setProperty('--r', (((i * 67) % 34) - 17) + 'deg');
            mini.style.transitionDelay = (i * 55) + 'ms';
            mini.innerHTML = `<img src="${p.thumb}" alt="">`;
            mini.addEventListener('click', () => openLb(i));
            scatter.appendChild(mini);
        });
        const endMsg = document.createElement('div');
        endMsg.className = 'de-msg';
        endMsg.innerHTML =
            '<div class="de-card">' +
              '<span class="de-xi">囍</span>' +
              '<span class="de-en">The End · 未完待續</span>' +
              '<p class="de-line">謝謝你陪我們看完這一頁頁回憶<br>我們最精彩的故事，才正要開始</p>' +
              '<button class="de-replay" type="button">↻ 重新播放</button>' +
            '</div>';
        deckEnd.appendChild(scatter);
        deckEnd.appendChild(endMsg);
        deckStage.appendChild(deckEnd);

        function showEnd() {
            deckRoot.classList.add('deck-ended');
            requestAnimationFrame(() => deckEnd.classList.add('on'));
        }
        endMsg.querySelector('.de-replay').addEventListener('click', () => {
            deckEnd.classList.remove('on');
            deckRoot.classList.remove('deck-ended');
            cur = 0;
            cards.forEach(c => c.style.transition = 'none');
            layout();
            void deckStage.offsetWidth;
            cards.forEach(c => c.style.transition = '');
        });

        if (deckNext) deckNext.addEventListener('click', () => fling(cards[cur], -1));
        if (deckPrev) deckPrev.addEventListener('click', () => { cur = (cur - 1 + photos.length) % photos.length; layout(); });

        layout();
    }

    /* ---------------------------------------------------
       Gallery — desktop cinematic dual-row marquee
       --------------------------------------------------- */
    const marquee = document.getElementById('marquee');
    const row = marquee ? marquee.querySelector('.marquee-row') : null;
    if (row && photos.length) {
        const openingQuote = { en: 'Our Love Story', cn: '從相遇<br>到未完待續' };
        const makeCard = (p, idx) => {
            const card = document.createElement('div');
            card.className = 'marquee-card';
            card.innerHTML = `<div class="mc-photo"><img src="${p.thumb}" width="${p.w}" height="${p.h}" draggable="false" alt=""></div><figcaption class="mc-cap">${p.cap}</figcaption>`;
            card.addEventListener('click', () => openLb(idx));
            return card;
        };
        const makeQuote = (q) => {
            const el = document.createElement('div');
            el.className = 'marquee-card mc-quote';
            el.innerHTML = `<span class="mq-en">${q.en}</span><span class="mq-cn">${q.cn}</span><span class="mq-xi">囍</span>`;
            return el;
        };
        // a "title card" opens the reel; the photos then play out the story in order
        const buildSet = () => {
            const frag = document.createDocumentFragment();
            frag.appendChild(makeQuote(openingQuote));
            photos.forEach((p, i) => frag.appendChild(makeCard(p, i)));
            return frag;
        };
        row.appendChild(buildSet());
        row.appendChild(buildSet());
        row.appendChild(buildSet());   // 3 copies → a full reel of runway on each side

        // gentle auto-drift + manual scroll / grab-to-pan (pauses while you interact)
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const speed = reduce ? 0 : 0.5;
        let hovering = false, dragging = false;
        marquee.addEventListener('pointerenter', () => hovering = true);
        marquee.addEventListener('pointerleave', () => hovering = false);

        let down = false, sx = 0, lastX = 0, moved = false;
        row.addEventListener('pointerdown', e => {
            down = true; dragging = true; moved = false;
            sx = lastX = e.clientX; row.classList.add('grabbing');
            try { row.setPointerCapture(e.pointerId); } catch (_) {}
        });
        row.addEventListener('pointermove', e => {
            if (!down) return;
            if (Math.abs(e.clientX - sx) > 4) moved = true;
            const cw = row.scrollWidth / 3 || 1;
            // incremental drag, kept inside the middle copy → pans BOTH ways with no wall
            let next = row.scrollLeft - (e.clientX - lastX);
            lastX = e.clientX;
            next = cw + (((next - cw) % cw) + cw) % cw;
            row.scrollLeft = next;
        });
        const end = () => { down = false; dragging = false; row.classList.remove('grabbing'); };
        row.addEventListener('pointerup', end);
        row.addEventListener('pointercancel', end);
        row.addEventListener('pointerleave', end);
        row.addEventListener('click', e => { if (moved) { e.stopPropagation(); e.preventDefault(); moved = false; } }, true);

        const startDrift = () => {
            row.scrollLeft = row.scrollWidth / 3;   // start centred in the middle copy
            const tick = () => {
                const cw = row.scrollWidth / 3;
                if (!hovering && !dragging && speed) row.scrollLeft += speed;
                if (row.scrollLeft >= 2 * cw) row.scrollLeft -= cw;
                else if (row.scrollLeft < cw) row.scrollLeft += cw;
                requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
        };
        if (document.readyState === 'complete') requestAnimationFrame(startDrift);
        else window.addEventListener('load', () => requestAnimationFrame(startDrift));
    }

    /* ---------------------------------------------------
       Scroll reveal
       --------------------------------------------------- */
    const revealEls = document.querySelectorAll('.details-hotel, .sec-head, .gallery-lead, .invite-lead, .invite-text, .invite-sign, .invite-quote, .detail-card, .map-frame, .marquee, .deck, .rsvp-desc, .rsvp-form, .cd-item');
    revealEls.forEach(el => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
        entries.forEach(en => {
            if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
        });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));

    /* ---------------------------------------------------
       RSVP form → Google Form (feeds their Google Sheet)
       --------------------------------------------------- */
    const rsvpForm = document.getElementById('rsvpForm');
    const relSel = document.getElementById('f_relation');
    const relOtherWrap = document.getElementById('relOtherWrap');
    const relOtherInput = document.getElementById('f_relation_other');
    const rsvpStatus = document.getElementById('rsvpStatus');
    const rsvpSubmit = document.getElementById('rsvpSubmit');

    /* Mainland-China RSVP: Google Forms is blocked in China. Paste the China-accessible
       form link (問卷星 / 騰訊問卷) here and the China-guest RSVP button appears automatically. */
    const CN_RSVP_URL = '';
    const rsvpCn = document.getElementById('rsvpCn');
    if (CN_RSVP_URL && rsvpCn) {
        document.getElementById('rsvpCnLink').href = CN_RSVP_URL;
        rsvpCn.hidden = false;
    }

    const FORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSctGh7pWUrNPjCQebD256VH_ZgslGA7gkVcPljw2pbNYONFjQ/formResponse';
    const ENTRY = {
        name: 'entry.1006166322',
        email: 'entry.1180022448',
        attend: 'entry.1632285062',
        relation: 'entry.228488511',
        count: 'entry.567367260',
        baby: 'entry.1002241896',
        diet: 'entry.471940828',
        car: 'entry.1042591750',
        seat: 'entry.1317033145',
        contact: 'entry.2067125598',
        words: 'entry.266971556'
    };

    if (relSel) {
        relSel.addEventListener('change', () => {
            const other = relSel.value === '__other';
            relOtherWrap.classList.toggle('is-hidden', !other);
            relOtherInput.required = other;
            if (!other) relOtherInput.value = '';
        });
    }

    if (rsvpForm) {
        rsvpForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const g = n => (rsvpForm.elements[n] ? rsvpForm.elements[n].value.trim() : '');

            // minimal validation for required fields
            const required = { '姓名': g('name'), 'Email': g('email'), '是否出席': g('attend'), '關係': g('relation'), '出席人數': g('count') };
            for (const [label, val] of Object.entries(required)) {
                if (!val) { setStatus(`請填寫「${label}」`, 'err'); return; }
            }
            if (g('relation') === '__other' && !g('relation_other')) { setStatus('請填寫與我們的關係', 'err'); return; }
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g('email'))) { setStatus('Email 格式似乎不正確', 'err'); return; }

            const fd = new FormData();
            fd.append(ENTRY.name, g('name'));
            fd.append(ENTRY.email, g('email'));
            fd.append(ENTRY.attend, g('attend'));
            if (g('relation') === '__other') {
                fd.append(ENTRY.relation, '__other_option__');
                fd.append(ENTRY.relation + '.other_option_response', g('relation_other'));
            } else {
                fd.append(ENTRY.relation, g('relation'));
            }
            fd.append(ENTRY.count, g('count'));
            if (g('baby')) fd.append(ENTRY.baby, g('baby'));
            if (g('diet')) fd.append(ENTRY.diet, g('diet'));
            if (g('car')) fd.append(ENTRY.car, g('car'));
            if (g('seat')) fd.append(ENTRY.seat, g('seat'));
            if (g('contact')) fd.append(ENTRY.contact, g('contact'));
            if (g('words')) fd.append(ENTRY.words, g('words'));

            const attending = g('attend') === '參加，必須參加';
            rsvpSubmit.disabled = true;
            const original = rsvpSubmit.textContent;
            rsvpSubmit.textContent = '傳送中…';
            setStatus('', '');

            fetch(FORM_ACTION, { method: 'POST', body: fd, mode: 'no-cors' })
                .then(() => {
                    rsvpSubmit.textContent = '已送出 ✓';
                    setStatus('感謝您的回覆，我們已收到您的心意 ♥', 'ok');
                    rsvpForm.reset();
                    relOtherWrap.classList.add('is-hidden');
                    setTimeout(() => { rsvpSubmit.disabled = false; rsvpSubmit.textContent = original; }, 4000);
                    if (attending) setTimeout(openCalModal, 600);
                })
                .catch(() => {
                    rsvpSubmit.disabled = false;
                    rsvpSubmit.textContent = original;
                    setStatus('送出時發生問題，請改用下方 Google 表單連結 🙏', 'err');
                });
        });
    }

    function setStatus(msg, kind) {
        if (!rsvpStatus) return;
        rsvpStatus.textContent = msg;
        rsvpStatus.className = 'rsvp-status' + (kind ? ' ' + kind : '');
    }

    /* ---------------------------------------------------
       Add to calendar
       --------------------------------------------------- */
    const calBtn = document.getElementById('calBtn');

    function gcalUrl() {
        const p = new URLSearchParams({
            action: 'TEMPLATE',
            text: WEDDING.title,
            dates: `${WEDDING.start}/${WEDDING.end}`,
            details: WEDDING.desc.replace(/\\n/g, '\n'),
            location: WEDDING.location,
            ctz: 'Asia/Taipei'
        });
        return `https://calendar.google.com/calendar/render?${p.toString()}`;
    }
    function icsBlob() {
        const ics = [
            'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//XiangHong-YanYu//Wedding//EN',
            'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
            'BEGIN:VTIMEZONE', 'TZID:Asia/Taipei', 'BEGIN:STANDARD',
            'TZOFFSETFROM:+0800', 'TZOFFSETTO:+0800', 'TZNAME:CST',
            'DTSTART:19700101T000000', 'END:STANDARD', 'END:VTIMEZONE',
            'BEGIN:VEVENT',
            `DTSTART;TZID=Asia/Taipei:${WEDDING.start}`,
            `DTEND;TZID=Asia/Taipei:${WEDDING.end}`,
            `SUMMARY:${WEDDING.title}`,
            `DESCRIPTION:${WEDDING.desc}`,
            `LOCATION:${WEDDING.location}`,
            'STATUS:CONFIRMED', 'UID:xianghong-yanyu-2026-10-25@wedding',
            'END:VEVENT', 'END:VCALENDAR'
        ].join('\r\n');
        return new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    }

    function openCalModal() {
        let modal = document.getElementById('calModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'calModal';
            modal.className = 'cal-modal';
            modal.innerHTML = `
                <div class="cal-box">
                    <div class="foot-xi" style="font-size:2rem">囍</div>
                    <h3>加入行事曆</h3>
                    <p>別錯過我們的大喜之日<br>2026 / 10 / 25 (日) 18:00</p>
                    <div class="cal-buttons">
                        <a class="btn btn-solid" id="calGoogle" href="${gcalUrl()}" target="_blank" rel="noopener">Google 日曆</a>
                        <button class="btn btn-line" id="calIcs">下載 .ics 檔（Apple / Outlook）</button>
                    </div>
                    <button class="cal-skip" id="calClose">稍後再說</button>
                </div>`;
            document.body.appendChild(modal);
            modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('open'); });
            modal.querySelector('#calClose').addEventListener('click', () => modal.classList.remove('open'));
            modal.querySelector('#calGoogle').addEventListener('click', () => modal.classList.remove('open'));
            modal.querySelector('#calIcs').addEventListener('click', () => {
                const a = document.createElement('a');
                a.href = URL.createObjectURL(icsBlob());
                a.download = 'XiangHong_YanYu_Wedding.ics';
                document.body.appendChild(a); a.click(); document.body.removeChild(a);
                URL.revokeObjectURL(a.href);
                modal.classList.remove('open');
            });
        } else {
            modal.querySelector('#calGoogle').setAttribute('href', gcalUrl());
        }
        modal.classList.add('open');
    }
    if (calBtn) calBtn.addEventListener('click', openCalModal);
});
