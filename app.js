'use strict'

(function(){
    const $list = $('#coffee-list');
    let data = [];
    let page = 1;
    const perPage = 3; 

    document.addEventListener('DOMContentLoaded', () => {
        document.getElementById('year').textContent = new Date().getFullYear();
    });

    $(function(){
      $('#learn-tabs').tabs();
    }); 

    $(function(){
        $('.carousel').slick({
            dots: true,
            arrows: true,
            autoplay: true,
            autoplaySpeed: 2500,
            adaptiveHeight: false
        });
    });

    function renderPage(){
        const start = (page -1) * perPage;
        const items = data.slice(start, start + perPage);
        $list.empty();

        items.forEach(item => {
            const card = $('
                <article class="card">
                  <img src="${item.image}" alt="${item.name}"> 
                  <h3>${item.name}</h3>
                  <p>${item.desc}</p>
                  <p class="price">$${item.price.toFixed(2)}</p>
                  </article>
            ');
            $list.append(card);
        });

        $('#pageLabel').text('Page ${page} of ${Math.ceil(data.length / perPage)}');
    }

    async function loadData() {
        try {
            const res = await fetch('data/coffees.json');
            const json = await res.json();
            data = json.coffees;
            renderPage();
        }catch(err){
            console.error('Failed to load coffees.json', err); 
            $list.html('<p>Could not load menu. Please run from a local server.</p>');
        }
    }

    $('#prev').on('click', function(){
        if(page > 1){ page--; renderPage(); }
    });
    $('#next').on('click', function(){
        if(page < Math.ceil(data.length / perPage)){ page++; renderPage(); }
    });

    function showPrefs(){
        const saved = JSON.parse(localStorage.getItem('coffeePrefs') || 'null');
        const box = document.getElementById('prefsDisplay'); 
        if(!saved){
            box.textContent = 'Nothing save yet. Use the form to store your preferences';
            return;
        }
        box.innerHTML = `<strong>Welcome, ${saved.name}!</strong><br>
           Roast: ${saved.roast}<br>
           Sweetness: ${saved.sweet}/10<br>
           <em>We\'ll remember this for next time.</em>`;
        const tagline = document.querySelector('.tagline');
        if(saved.name && tagline){
            tagline.textContent = `Brewing better for ${saved.name}`;
        }
    }

    document.getElementById('prefsForm').addEventListener('submit', function(e){
        e.preventDefault();
        const data = {
            name: (document.getElementById('name').value || '').trim(),
            roast: document.getElementById('roast').value,
            sweet: document.getElementById('sweet').value
        };
        localStorage.setItem('coffeePrefs', JSON.stringify(data));
        showPrefs();
        this.reset();
    });

    document.getElementById('clearPrefs').addEventListener('submit', function(e){
        e.preventDefault();
        if(this.checkValidity()){
            alert('Thanks! Your message is steeping in our inbox.');
            this.reset();
        }else{
            alert('Please fill out the form completely.');
        }
    });

    document.addEventListener('DOMContentLoaded', function(){
        showPrefs();
        loadData();
    });
})();
