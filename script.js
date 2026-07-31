document.addEventListener('DOMContentLoaded', () => {

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
       Gallery — realistic page-flip flipbook (StPageFlip)
       --------------------------------------------------- */
    const flipEl = document.getElementById('flipbook');
    if (flipEl && items.length && window.St && St.PageFlip) {
        const story = items.map((f) => {
            const im = f.querySelector('img');
            const parts = (f.dataset.cap || '').split('·');
            return {
                idx: items.indexOf(f),
                thumb: im.getAttribute('src'),
                w: im.getAttribute('width') || '',
                h: im.getAttribute('height') || '',
                title: (parts[0] || '').trim(),
                en: (parts[1] || '').trim(),
                desc: f.dataset.line || ''
            };
        });

        const addPage = (html, hard) => {
            const p = document.createElement('div');
            p.className = 'page';
            if (hard) p.setAttribute('data-density', 'hard');
            p.innerHTML = html;
            flipEl.appendChild(p);
            return p;
        };

        // front cover
        addPage(
            '<div class="pg pg-cover">' +
              '<span class="pc-en">Our Love Story</span>' +
              '<h2 class="pc-names">翔鴻 <i>&amp;</i> 晏瑜</h2>' +
              '<span class="pc-xi">囍</span>' +
              '<span class="pc-sub">一部關於我們的電影<br>從相遇，到未完待續</span>' +
            '</div>', true);

        // each beat = a spread: photo (left) + text (right)
        story.forEach((d, i) => {
            const n = String(i + 1).padStart(2, '0');
            addPage(
                '<div class="pg pg-photo">' +
                  '<img src="' + d.thumb + '" width="' + d.w + '" height="' + d.h + '" alt="">' +
                  '<button class="pg-zoom" data-idx="' + d.idx + '" aria-label="放大照片">' +
                    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>' +
                  '</button>' +
                '</div>');
            addPage(
                '<div class="pg pg-text">' +
                  '<span class="pt-ch">Chapter ' + n + '</span>' +
                  '<h3 class="pt-title">' + d.title + '</h3>' +
                  (d.en ? '<span class="pt-en">' + d.en + '</span>' : '') +
                  '<div class="pt-rule"></div>' +
                  '<p class="pt-desc">' + d.desc + '</p>' +
                  '<span class="pt-xi">囍</span>' +
                  '<span class="pt-no">— ' + n + ' —</span>' +
                '</div>');
        });

        // back cover
        addPage(
            '<div class="pg pg-cover pg-back">' +
              '<span class="pc-en">To be continued…</span>' +
              '<h2 class="pc-fin">未完待續</h2>' +
              '<span class="pc-xi">囍</span>' +
              '<span class="pc-sub">因為，我們最精彩的故事，才正要開始<br>Because our best chapter is yet to come</span>' +
            '</div>', true);

        // zoom buttons → open the full image in the lightbox
        flipEl.querySelectorAll('.pg-zoom').forEach((btn) => {
            btn.addEventListener('click', (e) => { e.stopPropagation(); openLb(parseInt(btn.dataset.idx, 10)); });
        });

        const pageFlip = new St.PageFlip(flipEl, {
            width: 440, height: 600, size: 'stretch',
            minWidth: 300, maxWidth: 680, minHeight: 380, maxHeight: 900,
            drawShadow: true, maxShadowOpacity: 0.5,
            showCover: true, usePortrait: true, mobileScrollSupport: false,
            flippingTime: 800, swipeDistance: 30
        });
        pageFlip.loadFromHTML(flipEl.querySelectorAll('.page'));

        const fbPage = document.getElementById('fbPage');
        const total = pageFlip.getPageCount();
        const setLabel = () => { fbPage.textContent = (pageFlip.getCurrentPageIndex() + 1) + ' / ' + total; };
        setLabel();
        pageFlip.on('flip', setLabel);
        pageFlip.on('changeOrientation', setLabel);

        document.getElementById('fbPrev').addEventListener('click', () => pageFlip.flipPrev());
        document.getElementById('fbNext').addEventListener('click', () => pageFlip.flipNext());
        document.addEventListener('keydown', (e) => {
            if (lightbox.classList.contains('open')) return;
            if (e.key === 'ArrowRight') pageFlip.flipNext();
            else if (e.key === 'ArrowLeft') pageFlip.flipPrev();
        });

        const wrap = document.getElementById('flipbookWrap');
        document.getElementById('fbFull').addEventListener('click', () => {
            if (document.fullscreenElement) document.exitFullscreen();
            else if (wrap.requestFullscreen) wrap.requestFullscreen().catch(() => {});
        });
    }

    /* ---------------------------------------------------
       Scroll reveal
       --------------------------------------------------- */
    const revealEls = document.querySelectorAll('.details-hotel, .sec-head, .gallery-lead, .invite-lead, .invite-text, .invite-sign, .invite-quote, .detail-card, .map-frame, .fb-hint, .rsvp-desc, .rsvp-form, .cd-item');
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
