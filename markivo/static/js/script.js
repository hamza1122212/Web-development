document.addEventListener('DOMContentLoaded', () => {

    
    const navbar = document.querySelector('nav');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
           
            navbar.style.background = 'rgba(15, 15, 22, 0.98)';
            navbar.style.boxShadow = '0 4px 30px rgba(0,0,0,0.5)';
            navbar.style.padding = '0.8rem 5%'; 
        } else {
            navbar.classList.remove('scrolled');
            navbar.style.background = 'rgba(15, 15, 22, 0.9)';
            navbar.style.boxShadow = 'none';
            navbar.style.padding = '1rem 5%';
        }
    });

    
    const navLinks = document.querySelector('.nav-links');
    
    
    let burger = document.querySelector('.burger');
    if (!burger) {
        burger = document.createElement('div');
        burger.innerHTML = '☰';
        burger.className = 'burger';
       
        burger.style.fontSize = '2rem';
        burger.style.color = '#fff';
        burger.style.cursor = 'pointer';
        burger.style.display = 'none'; 
        navbar.appendChild(burger);
    }

    
    const toggleMenu = () => {
        navLinks.classList.toggle('nav-active');
        
        
        if (navLinks.classList.contains('nav-active')) {
            burger.innerHTML = '✕';
            navLinks.style.transform = 'translateX(0%)';
        } else {
            burger.innerHTML = '☰';
            navLinks.style.transform = 'translateX(100%)';
        }
    };

    burger.addEventListener('click', toggleMenu);

   
    const checkMobile = () => {
        if (window.innerWidth <= 768) {
            burger.style.display = 'block';
            
            
            navLinks.style.position = 'fixed';
            navLinks.style.right = '0';
            navLinks.style.top = '70px';
            navLinks.style.height = 'calc(100vh - 70px)';
            navLinks.style.background = 'rgba(15, 15, 22, 0.98)';
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.alignItems = 'center';
            navLinks.style.justifyContent = 'space-evenly';
            navLinks.style.width = '100%'; 
            navLinks.style.transform = 'translateX(100%)';
            navLinks.style.transition = 'transform 0.4s ease-in-out';
            navLinks.style.zIndex = '999';
        } else {
            burger.style.display = 'none';
            navLinks.style.position = 'static';
            navLinks.style.flexDirection = 'row';
            navLinks.style.height = 'auto';
            navLinks.style.background = 'transparent';
            navLinks.style.transform = 'translateX(0)';
            navLinks.style.width = 'auto';
        }
    };

    window.addEventListener('resize', checkMobile);
    checkMobile(); 

    
    const glassCards = document.querySelectorAll('.glass');

    glassCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top;  

            
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

});

const applyDynamicTheme = (primary, secondary) => {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
};


// applyDynamicTheme('#FFD700', '#4B0082');