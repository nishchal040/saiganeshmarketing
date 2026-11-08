// Global Selectors
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const header = document.querySelector(".main-header");
const navLinks = document.querySelectorAll(".nav-links li a");
const form = document.querySelector(".contact-form");
const contactCtaBtn = document.querySelector("#contact-cta-btn");
const downloadBrochureBtn = document.querySelector("#download-brochure-btn");
const closeBtn = document.querySelector("#close-btn");
const menu = document.querySelector(".menu");
const menuOptions = document.querySelector(".nav-links");

let current = 0;
let slideInterval;

// 1. Hero Slider Logic
function showSlide(index) {
    if (!slides || slides.length === 0) return;
    
    const total = slides.length;
    current = ((index % total) + total) % total;

    slides.forEach((slide, i) => {
        if (i === current) {
            slide.classList.add("active");
        } else {
            slide.classList.remove("active");
        }
    });

    dots.forEach((dot, i) => {
        if (i === current) {
            dot.classList.add("active");
        } else {
            dot.classList.remove("active");
        }
    });
}

function nextSlide() {
    showSlide(current + 1);
}

function prevSlide() {
    showSlide(current - 1);
}

function stopSlider() {
    if (slideInterval) {
        clearInterval(slideInterval);
        slideInterval = null;
    }
}

function startSlider() {
    stopSlider();
    if (slides.length > 1) {
        slideInterval = setInterval(nextSlide, 5000); // 5 seconds interval for luxury feel
    }
}

// 2. Sticky Header Scroll Effect
function updateHeaderScroll() {
    if (header) {
        if (window.scrollY > 20) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
}
window.addEventListener("scroll", updateHeaderScroll, { passive: true });
updateHeaderScroll();

// 3. Navigation Active Highlight on Scroll (for hash anchors)
const sections = document.querySelectorAll("section[id]");
window.addEventListener("scroll", () => {
    let currentSection = "";
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 150;
        if (window.scrollY >= sectionTop) {
            currentSection = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        const href = link.getAttribute("href");
        if (href && (href.startsWith("#") || href.includes("#"))) {
            const hash = href.substring(href.indexOf("#"));
            if (hash === `#${currentSection}`) {
                navLinks.forEach(l => l.classList.remove("active"));
                link.classList.add("active");
            }
        }
    });
});

// 4. Contact Form Modal Logic
function openForm() {
    if (form) {
        form.classList.add("show");
        document.body.style.overflow = "hidden"; // Prevent scrolling behind modal
    }
}

function closeForm() {
    if (form) {
        form.classList.remove("show");
        document.body.style.overflow = "auto";
    }
}

// Trigger Form on CTA click
if (contactCtaBtn) {
    contactCtaBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openForm();
    });
}

// Brochure Download Action (native PDF download allowed)
if (downloadBrochureBtn) {
    // Allows direct download of assets/Sai_Ganesh_Marketing_Catalogue.pdf
}

// Trigger Form load after 5 seconds
document.addEventListener("DOMContentLoaded", () => {
    // Start slider if exists
    if (slides && slides.length > 0) {
        showSlide(0);
        startSlider();
        
        dots.forEach(dot => {
            dot.addEventListener("click", (e) => {
                const slideIndex = parseInt(e.currentTarget.dataset.slide, 10);
                if (!isNaN(slideIndex)) {
                    showSlide(slideIndex);
                    startSlider(); // Restart interval on user interaction
                }
            });
        });

        // Pause on hover over hero section
        const heroSection = document.querySelector(".hero");
        if (heroSection) {
            heroSection.addEventListener("mouseenter", stopSlider);
            heroSection.addEventListener("mouseleave", startSlider);

            // Mobile swipe support
            let touchStartX = 0;
            let touchEndX = 0;
            heroSection.addEventListener("touchstart", (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            heroSection.addEventListener("touchend", (e) => {
                touchEndX = e.changedTouches[0].screenX;
                if (touchStartX - touchEndX > 50) {
                    nextSlide();
                    startSlider();
                } else if (touchEndX - touchStartX > 50) {
                    prevSlide();
                    startSlider();
                }
            }, { passive: true });
        }
    }

    // Popup occurs ONLY ONCE and ONLY on the HOME PAGE
    const path = window.location.pathname.toLowerCase();
    const isHome = path.endsWith("index.html") || 
                   path === "/" || 
                   path.endsWith("/") || 
                   path === "" || 
                   (!path.includes("about") && !path.includes("services") && !path.includes("categories") && !path.includes("project") && !path.includes("whychooseus") && !path.includes("blog") && !path.includes("contactus") && !path.includes("article"));

    if (isHome && !sessionStorage.getItem("sgm_home_popup_shown")) {
        setTimeout(() => {
            if (form && !form.classList.contains("show") && !sessionStorage.getItem("sgm_home_popup_shown")) {
                openForm();
                sessionStorage.setItem("sgm_home_popup_shown", "true");
            }
        }, 5000);
    }
});

// Close Form logic
if (closeBtn) {
    closeBtn.addEventListener("click", () => {
        closeForm();
    });
}

// Close form on Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closeForm();
        closeLightbox();
        closeCatalogModal();
        closeBlogReader();
    }
});

// 5. Mobile Hamburger Menu Logic
if (menu && menuOptions) {
    menu.addEventListener("click", (e) => {
        e.stopPropagation();
        menu.classList.toggle("active");
        menuOptions.classList.toggle("show");

        document.body.style.overflow =
            menuOptions.classList.contains("show") ? "hidden" : "auto";
    });

    document.querySelectorAll(".nav-links li a").forEach(link => {
        link.addEventListener("click", () => {
            menu.classList.remove("active");
            menuOptions.classList.remove("show");
            document.body.style.overflow = "auto";
        });
    });

    // Close menu when clicking outside on mobile
    document.addEventListener("click", (e) => {
        if (menuOptions.classList.contains("show") && !menuOptions.contains(e.target) && !menu.contains(e.target)) {
            menu.classList.remove("active");
            menuOptions.classList.remove("show");
            document.body.style.overflow = "auto";
        }
    });

    // Reset overflow on desktop resize
    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            menu.classList.remove("active");
            menuOptions.classList.remove("show");
            document.body.style.overflow = "auto";
        }
    });
}

// 6. Email JS Form Submit
function sendMail(e) {
    e.preventDefault();
    const formEl = e.target;
    const nameEl = formEl.querySelector("#name") || document.getElementById("name");
    const emailEl = formEl.querySelector("#email") || document.getElementById("email");
    const numberEl = formEl.querySelector("#number") || document.getElementById("number");
    const categoryEl = formEl.querySelector("#category") || document.getElementById("category");
    const areaEl = formEl.querySelector("#area") || document.getElementById("area");
    const messageEl = formEl.querySelector("#message") || document.getElementById("message");

    const submitBtn = formEl.querySelector("button[type='submit']");
    const originalText = submitBtn ? submitBtn.innerText : "Submit";
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerText = "Sending...";
    }

    if (typeof emailjs === "undefined") {
        alert("Email service is temporarily unavailable. Please WhatsApp us at +91 9989640450.");
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }
        return;
    }

    emailjs.send("service_wumsb9b", "template_k0zp5nd", {
        name: nameEl ? nameEl.value : "",
        email: emailEl ? emailEl.value : "",
        number: numberEl ? numberEl.value : "",
        category: categoryEl ? categoryEl.value : "",
        location: areaEl ? areaEl.value : "",
        message: messageEl ? messageEl.value : ""
    })
    .then(function() {
        alert("Message Sent Successfully! Our team will get in touch with you shortly.");
        formEl.reset();
        if (typeof closeForm === "function") closeForm();
    }, function(error) {
        alert("Failed to send message. Please reach us on WhatsApp at +91 9989640450.");
    })
    .finally(function() {
        if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerText = originalText;
        }
    });
}

// 7. Counter Stats Animation (Intersection Observer)
const counters = document.querySelectorAll(".count");
if (counters.length > 0) {
    const counterObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.dataset.target;
                const suffix = (counter.innerText.includes("%") || target === 100) ? "%" : "+";
                let current = 0;

                const update = () => {
                    const increment = Math.max(1, target / 60);

                    if (current < target) {
                        current += increment;
                        counter.innerText = Math.floor(current) + suffix;
                        requestAnimationFrame(update);
                    } else {
                        counter.innerText = target + suffix;
                    }
                };

                update();
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.2 });

    counters.forEach(c => counterObserver.observe(c));
}

// 8. Interactive Timeline Logic (About Page)
const timelineNodes = document.querySelectorAll(".timeline-node");
const milestoneCards = document.querySelectorAll(".milestone-card");

if (timelineNodes.length > 0 && milestoneCards.length > 0) {
    timelineNodes.forEach(node => {
        node.addEventListener("click", () => {
            timelineNodes.forEach(n => n.classList.remove("active"));
            node.classList.add("active");
            
            milestoneCards.forEach(c => c.classList.remove("active"));
            
            const year = node.dataset.year;
            const targetCard = document.getElementById(`milestone-${year}`);
            if (targetCard) {
                targetCard.classList.add("active");
            }
        });
    });
}

// 9. Interactive Projects Filter & Lightbox (Projects Page)
const filterTabs = document.querySelectorAll(".filter-tab");
const projectCards = document.querySelectorAll(".portfolio-project-card");

// Filter grid cards
if (filterTabs.length > 0 && projectCards.length > 0 && !document.getElementById("categories-grid") && !document.getElementById("blogs-grid")) {
    filterTabs.forEach(tab => {
        tab.addEventListener("click", () => {
            filterTabs.forEach(t => t.classList.remove("active"));
            tab.classList.add("active");
            
            const categoryFilter = tab.dataset.filter;
            
            projectCards.forEach(card => {
                const cardCategory = card.dataset.category;
                
                if (categoryFilter === "all" || cardCategory === categoryFilter) {
                    card.style.display = "block";
                    setTimeout(() => {
                        card.style.opacity = "1";
                        card.style.transform = "scale(1)";
                    }, 50);
                } else {
                    card.style.opacity = "0";
                    card.style.transform = "scale(0.95)";
                    setTimeout(() => {
                        card.style.display = "none";
                    }, 300);
                }
            });
        });
    });
}

// Lightbox Data Map
const projectDetails = {
    "Luxury Villa - Hyderabad": {
        tag: "RESIDENTIAL PROJECT",
        purpose: "Project Scope: Complete custom high-end sanitaryware, electrical and tiles supply.",
        specs: [
            "<strong>Client Location:</strong> Jubilee Hills, Hyderabad.",
            "<strong>Hardware Supplied:</strong> High-end vitrified flooring tiles and designer bathrooms.",
            "<strong>Plumbing Quality:</strong> Fully Prince/Ashirvad leakage-proof plumbing setup.",
            "<strong>Project Outcome:</strong> 100% satisfaction, finished on time."
        ]
    },
    "Corporate Office - Bangalore": {
        tag: "COMMERCIAL PROJECT",
        purpose: "Project Scope: End-to-end office lighting, tiles and plumbing distributions.",
        specs: [
            "<strong>Client Location:</strong> Whitefield, Bangalore Tech Park.",
            "<strong>Hardware Supplied:</strong> Professional grade commercial tiles and lighting setups.",
            "<strong>Pipes and Valves:</strong> Prince heavy-duty pipelines and sanitaryware basins.",
            "<strong>Project Outcome:</strong> Eco-friendly materials used, delivered under budget."
        ]
    },
    "Retail Store - Mumbai": {
        tag: "RETAIL PROJECT",
        purpose: "Project Scope: High quality storefront tiles, accents, and custom electrical fixtures.",
        specs: [
            "<strong>Client Location:</strong> Colaba Causeway, Mumbai.",
            "<strong>Hardware Supplied:</strong> Slip-resistant porcelain tiles and designer accents.",
            "<strong>Electrical setup:</strong> Energy-efficient premium LED lighting frameworks.",
            "<strong>Project Outcome:</strong> Sleek commercial aesthetics, 100% client satisfaction."
        ]
    },
    "Hotel Project - Goa": {
        tag: "HOSPITALITY PROJECT",
        purpose: "Project Scope: Premium sanitaryware, tiles and complete building fittings for a luxury resort.",
        specs: [
            "<strong>Client Location:</strong> Candolim Beach Resort, Goa.",
            "<strong>Hardware Supplied:</strong> Anti-skid pool tiles, bath enclosures, and premium closets.",
            "<strong>Water systems:</strong> Custom high-pressure hot/cold pipeline distributions.",
            "<strong>Project Outcome:</strong> Luxury vacation vibe, completed in record time."
        ]
    },
    "Hospital Project - Vizag": {
        tag: "HEALTHCARE PROJECT",
        purpose: "Project Scope: Standard hygiene-compliant sanitaryware, pipes, and medical-grade lighting.",
        specs: [
            "<strong>Client Location:</strong> Gajuwaka Medical Center, Vizag.",
            "<strong>Hardware Supplied:</strong> Specialized anti-bacterial tiles and surgical basins.",
            "<strong>Pipelines quality:</strong> Heavy-duty, lead-free certified plumbing systems.",
            "<strong>Project Outcome:</strong> 100% health-code compliant, 15-year warranty supplied."
        ]
    },
    "Industrial Unit - Pune": {
        tag: "INDUSTRIAL PROJECT",
        purpose: "Project Scope: High-volume drainage, heavy-duty industrial pipe supply, and high-bay lighting.",
        specs: [
            "<strong>Client Location:</strong> Chakan Industrial Area, Pune.",
            "<strong>Hardware Supplied:</strong> Acid-resistant chemical flooring tiles and drainage grids.",
            "<strong>Plumbing Quality:</strong> Sudhakar & Ashirvad high-diameter industrial pipelines.",
            "<strong>Project Outcome:</strong> Heavy load resistant, robust pipeline durability guaranteed."
        ]
    }
};

const lightboxModal = document.getElementById("lightbox-modal");
const lightboxImg = document.getElementById("lightbox-img");
const lightboxTitle = document.getElementById("lightbox-title");
const lightboxTag = document.getElementById("lightbox-tag");
const lightboxPurpose = document.getElementById("lightbox-purpose");
const lightboxSpecsList = document.getElementById("lightbox-specs-list");
const lightboxClose = document.getElementById("lightbox-close");

function openLightbox(card) {
    if (!lightboxModal) return;
    
    const cardTitle = card.querySelector("h3").innerText;
    const cardImgSrc = card.querySelector("img").src;
    
    // Get details from map
    const details = projectDetails[cardTitle];
    if (!details) return;
    
    // Populate elements
    lightboxImg.src = cardImgSrc;
    lightboxTitle.innerText = cardTitle;
    lightboxTag.innerText = details.tag;
    lightboxPurpose.innerText = details.purpose;
    
    // Clear and populate specifications list
    lightboxSpecsList.innerHTML = "";
    details.specs.forEach(spec => {
        const li = document.createElement("li");
        li.innerHTML = spec;
        lightboxSpecsList.appendChild(li);
    });
    
    // Show modal
    lightboxModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeLightbox() {
    if (lightboxModal) {
        lightboxModal.classList.remove("show");
        document.body.style.overflow = "auto";
    }
}

// Allow full page navigation to project-details.html on card click
if (projectCards.length > 0 && !document.getElementById("categories-grid") && !document.getElementById("blogs-grid")) {
    projectCards.forEach(card => {
        // If card is an anchor or has href, allow natural navigation to project-details.html
        if (!card.hasAttribute("href")) {
            card.addEventListener("click", () => {
                openLightbox(card);
            });
        }
    });
}

if (lightboxClose) {
    lightboxClose.addEventListener("click", () => {
        closeLightbox();
    });
}

if (lightboxModal) {
    lightboxModal.addEventListener("click", (e) => {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });
}

// 10. Products Page Filtering and PDF Catalog Modal (categories.html)
const categorySearchInput = document.getElementById("category-search-input");
const categoryCards = document.querySelectorAll(".category-item-card");
const brandFilters = document.querySelectorAll("input[name='brand-filter']");
const catTypeButtons = document.querySelectorAll("#cat-type-filters .blog-cat-btn");
const noCategoriesError = document.getElementById("no-categories-error");
let activeCategoryType = "all";

// Filter categories dynamically
function filterCategories() {
    if (categoryCards.length === 0) return;
    
    const searchTerm = categorySearchInput ? categorySearchInput.value.toLowerCase().trim() : "";
    let activeBrandFilter = "all";
    
    brandFilters.forEach(radio => {
        if (radio.checked) {
            activeBrandFilter = radio.value;
        }
    });
    
    let visibleCount = 0;
    
    categoryCards.forEach(card => {
        const cardTitle = card.querySelector("h3") ? card.querySelector("h3").innerText.toLowerCase() : "";
        const cardTag = card.querySelector(".project-tag") ? card.querySelector(".project-tag").innerText.toLowerCase() : "";
        const cardDesc = card.querySelector("p") ? card.querySelector("p").innerText.toLowerCase() : "";
        const cardBrands = (card.dataset.brands || "").split(" ");
        const cardCat = (card.dataset.category || "").toLowerCase();
        
        const matchesSearch = searchTerm === "" || 
                              cardTitle.includes(searchTerm) || 
                              cardTag.includes(searchTerm) || 
                              cardDesc.includes(searchTerm);
                              
        const matchesCategory = activeCategoryType === "all" || cardCat === activeCategoryType;
        
        const matchesBrand = activeBrandFilter === "all" || 
                             cardBrands.includes(activeBrandFilter) ||
                             (activeBrandFilter === "ashirvad" && (cardBrands.includes("ashirvad") || cardBrands.includes("prince"))) ||
                             (activeBrandFilter === "prince" && (cardBrands.includes("ashirvad") || cardBrands.includes("prince"))) ||
                             (activeBrandFilter === "legrand" && (cardBrands.includes("legrand") || cardBrands.includes("schneider"))) ||
                             (activeBrandFilter === "polycab" && (cardBrands.includes("polycab") || cardBrands.includes("havells")));
        
        if (matchesSearch && matchesCategory && matchesBrand) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });
    
    if (noCategoriesError) {
        noCategoriesError.style.display = (visibleCount === 0) ? "block" : "none";
    }
}

// Bind keyword search
if (categorySearchInput) {
    categorySearchInput.addEventListener("input", filterCategories);
}

// Bind brand radio filters
if (brandFilters.length > 0) {
    brandFilters.forEach(radio => {
        radio.addEventListener("change", filterCategories);
    });
}

// Bind department/category filter buttons
if (catTypeButtons.length > 0) {
    catTypeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            catTypeButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeCategoryType = btn.dataset.cat || "all";
            filterCategories();
        });
    });

    // Check URL parameters for direct filtering (e.g. categories.html?cat=electrical)
    const urlParams = new URLSearchParams(window.location.search);
    const catQuery = urlParams.get("cat");
    if (catQuery) {
        const matchingBtn = document.querySelector(`#cat-type-filters .blog-cat-btn[data-cat='${catQuery}']`);
        if (matchingBtn) {
            catTypeButtons.forEach(b => b.classList.remove("active"));
            matchingBtn.classList.add("active");
            activeCategoryType = catQuery;
            filterCategories();
        }
    }
}

// Catalog PDFs Map (Single Official Verified SGM Product Catalogue for all categories)
const officialSgmCatalog = {
    title: "Sai Ganesh Marketing Official Complete Product Catalogue",
    subtitle: "Sanitaryware, Vitrified Tiles, CPVC Plumbing & Electrical Switchgears",
    size: "2.5 MB",
    file: "assets/Sai_Ganesh_Marketing_Catalogue.pdf"
};

const catalogPdfs = new Proxy({}, {
    get: function(target, prop) {
        return [officialSgmCatalog];
    }
});

const catalogModal = document.getElementById("catalog-modal");
const catalogModalTitle = document.getElementById("catalog-modal-title");
const catalogModalTag = document.getElementById("catalog-modal-tag");
const catalogDownloadList = document.getElementById("catalog-download-list");
const catalogClose = document.getElementById("catalog-close");

function openCatalogModal(categoryName) {
    if (!catalogModal) return;
    
    catalogModalTitle.innerText = `${categoryName} - Official Catalogue`;
    catalogModalTag.innerText = `OFFICIAL SGM CATALOGUE`;
    
    // Clear and populate
    catalogDownloadList.innerHTML = "";
    
    const row = document.createElement("div");
    row.className = "catalog-pdf-row";
    const downloadUrl = "assets/Sai_Ganesh_Marketing_Catalogue.pdf";
    
    row.innerHTML = `
        <div class="pdf-row-info">
            <div class="pdf-row-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                </svg>
            </div>
            <div class="pdf-row-text">
                <h5>Sai Ganesh Marketing Official Product Catalogue</h5>
                <p>Complete authorized catalogue covering ${categoryName}, Sanitaryware, Vitrified Tiles, CPVC Pipes &amp; Electrical switchgear.</p>
                <p style="margin-top: 4px; font-weight: 600;">Format: PDF • Size: 2.5 MB • <span style="color: var(--accent-gold); font-weight: 700;">● Official SGM Catalogue</span></p>
            </div>
        </div>
        <div class="pdf-row-actions-group" style="display: flex; gap: 8px; align-items: center; flex-wrap: wrap;">
            <a href="${downloadUrl}" target="_blank" rel="noopener noreferrer" class="pdf-row-action pdf-view-btn" title="Open and view PDF catalogue in browser">VIEW <span class="arrow">↗</span></a>
            <a href="${downloadUrl}" download="Sai_Ganesh_Marketing_Catalogue.pdf" class="pdf-row-action pdf-download-btn" title="Download PDF to device">GET PDF <span class="arrow">↓</span></a>
        </div>
    `;
    
    catalogDownloadList.appendChild(row);
    
    catalogModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeCatalogModal() {
    if (catalogModal) {
        catalogModal.classList.remove("show");
        document.body.style.overflow = "auto";
    }
}

// Bind Category card clicks
if (document.getElementById("categories-grid")) {
    categoryCards.forEach(card => {
        card.addEventListener("click", () => {
            const categoryName = card.querySelector("h3").innerText;
            openCatalogModal(categoryName);
        });
    });
}

if (catalogClose) {
    catalogClose.addEventListener("click", closeCatalogModal);
}

if (catalogModal) {
    catalogModal.addEventListener("click", (e) => {
        if (e.target === catalogModal) {
            closeCatalogModal();
        }
    });
}

// 11. Dedicated Blogs Page Logic (blogs.html)
const blogSearchInput = document.getElementById("blog-search-input");
const blogCategoryBtns = document.querySelectorAll(".blog-cat-btn");
const blogItemCards = document.querySelectorAll(".blog-item-card");
const noBlogsError = document.getElementById("no-blogs-error");

let activeBlogCategory = "all";

function filterBlogs() {
    if (blogItemCards.length === 0) return;
    
    const searchTerm = blogSearchInput ? blogSearchInput.value.toLowerCase().trim() : "";
    let visibleCount = 0;
    
    blogItemCards.forEach(card => {
        const cardTitle = card.querySelector("h3") ? card.querySelector("h3").innerText.toLowerCase() : "";
        const cardSnippet = card.querySelector("p") ? card.querySelector("p").innerText.toLowerCase() : "";
        const cardCategory = (card.dataset.category || "").toLowerCase();
        
        const matchesSearch = searchTerm === "" || cardTitle.includes(searchTerm) || cardSnippet.includes(searchTerm);
        const matchesCategory = activeBlogCategory === "all" || cardCategory === activeBlogCategory.toLowerCase();
        
        if (matchesSearch && matchesCategory) {
            card.style.display = "flex";
            setTimeout(() => {
                card.style.opacity = "1";
                card.style.transform = "scale(1)";
            }, 30);
            visibleCount++;
        } else {
            card.style.opacity = "0";
            card.style.transform = "scale(0.96)";
            setTimeout(() => {
                card.style.display = "none";
            }, 250);
        }
    });
    
    if (noBlogsError) {
        noBlogsError.style.display = (visibleCount === 0) ? "block" : "none";
    }
}

// Bind blog category buttons
if (blogCategoryBtns.length > 0) {
    blogCategoryBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            blogCategoryBtns.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            activeBlogCategory = btn.dataset.cat || "all";
            filterBlogs();
        });
    });
}

// Bind blog search inputs
if (blogSearchInput) {
    blogSearchInput.addEventListener("input", filterBlogs);
}

// Full Article Content database map
const blogArticles = {
    "leak-proof-plumbing": {
        tag: "PLUMBING SYSTEMS",
        title: "Choosing CPVC Pipes for Leak-Proof Bathrooms",
        body: `
            <p><strong>Introduction:</strong> When laying sanitary pipelines inside concrete walls or ceiling slabs, choosing high-performance CPVC piping prevents catastrophic water leakage. Cheap, uncertified plastic pipes erode over time due to heat, water chemical residues, and pressure fluctuations.</p>
            
            <h4>Why CPVC is Superior for Residential Bathrooms:</h4>
            <ul>
                <li><strong>Chlorination Resistance:</strong> CPVC pipes are chemically structured to resist chlorine scale deposits, preventing pipe decay.</li>
                <li><strong>High Temperature Tolerances:</strong> Handles water up to 93°C, making it perfect for connection links to geysers and heaters.</li>
                <li><strong>Smooth Interstellar Walls:</strong> Reduces friction loss and limits noisy water flow.</li>
            </ul>

            <h4>Key Takeaways:</h4>
            <p>Always inspect the wall thickness rating (SDR 11 or SDR 13.5). For standard hot and cold connections, SDR 11 CPVC pipelines are recommended. Apply solvent cement evenly at fittings joints to create a chemical weld lock that guarantees zero leaks.</p>
            
            <h4>SGM Approved Dealership Brands:</h4>
            <p>We stock authorized, certified pipelines from <strong>Prince Pipes</strong> and <strong>Ashirvad Pipes</strong> at our Hyderabad warehouse. Visit us to get bulk discounts.</p>
        `
    },
    "sanitary-trends": {
        tag: "SANITARYWARE TRENDS",
        title: "Top 5 Luxury Sanitaryware Trends in 2026",
        body: `
            <p><strong>Introduction:</strong> Modern bathroom designs have shifted from simple utility spaces to private sanctuary spas. SGM highlights the top luxury trends that redefine bath experiences this year.</p>
            
            <h4>1. Rimless Wall-Hung Closets</h4>
            <p>Rimless designs ensure water sweeps the entire bowl surface. Wall-hung installation leaves flooring clear, expanding visual room.</p>
            
            <h4>2. Matte Black & Brushed Gold Fittings</h4>
            <p>Moving away from traditional chrome, luxury villas use matte black, brushed nickel, or champagne gold faucets to add high-contrast accents.</p>
            
            <h4>3. Smart Sensor Systems</h4>
            <p>Touchless faucets, automatic lid open/close toilets, and digital thermostatic mixers let users program temperature settings instantly.</p>

            <h4>SGM Recommendations:</h4>
            <p>Select premium closets from <strong>Cera</strong>, luxury faucets from <strong>Jaquar</strong>, and design walls from <strong>Kerovit</strong> to ensure beautiful hardware continuity.</p>
        `
    },
    "vitrified-tiles": {
        tag: "TILES & FLOORING",
        title: "Double Charge vs Glazed Vitrified Tiles",
        body: `
            <p><strong>Introduction:</strong> Selecting floor tiles requires balancing aesthetic preference and load durability. Here's SGM's guide to help you choose.</p>
            
            <h4>Double Charge Vitrified Tiles</h4>
            <p>Manufactured by pressing two layers of pigment clay together. The top pigment is 3-4mm thick, making it highly resistant to heavy foot traffic, scratch lines, and fading. Perfect for commercial offices, retail storefronts, and living room floors.</p>
            
            <h4>Glazed Vitrified Tiles (GVT)</h4>
            <p>Features an glazed digital print layer on top of a vitrified body. This allows for rich textures like marble vein lines, wooden planks, and stone patterns. Best for bathroom walls, accents, and private bedrooms.</p>

            <h4>Key Recommendation:</h4>
            <p>For high-traffic hallways and living rooms, choose <strong>Somany Double Charge</strong> tiles. For bathroom claddings, choose <strong>Somany Glazed Vitrified</strong> tiles. SGM Padmarao Nagar stocks complete catalog mock displays.</p>
        `
    },
    "switchgear-breakers": {
        tag: "ELECTRICAL SWITCHGEAR",
        title: "Essential Safety DB Breakers Checklist",
        body: `
            <p><strong>Introduction:</strong> House fires and appliance short-circuits are easily prevented with professional circuit breakers. A standard Distribution Board (DB) is the central safety shield of your home.</p>
            
            <h4>Core Breaker Categories Every House Needs:</h4>
            <ul>
                <li><strong>MCB (Miniature Circuit Breakers):</strong> Trips automatically when current exceeds safe load limits. Protects wiring lines.</li>
                <li><strong>RCCB (Residual Current Circuit Breakers):</strong> Instantly cuts power if leakage current is detected (prevents fatal shocks).</li>
                <li><strong>Surge Protective Devices (SPD):</strong> Shields smart appliances and computers from lightning surges.</li>
            </ul>

            <h4>Safe Installation Guideline:</h4>
            <p>Use certified modular boxes with proper IP ratings. Split high load appliances (geysers, ACs) on individual MCBs. SGM deals in certified switchgears from <strong>Legrand</strong> and <strong>Schneider Electric</strong>.</p>
        `
    },
    "recessed-lighting": {
        tag: "MODERN LIGHTING",
        title: "How Recessed Lighting Transforms Living Rooms",
        body: `
            <p><strong>Introduction:</strong> Recessed spotlights are embedded flush inside false ceilings, generating clean, ambient illuminations without occupying physical space. Layout configurations dictate living room aesthetics.</p>
            
            <h4>Guidelines for Ceiling Spotlights Setup:</h4>
            <ul>
                <li><strong>Spacing:</strong> Keep spot panels at least 3-4 feet away from walls and space them evenly to eliminate shadow spots.</li>
                <li><strong>Color Temperature:</strong> Use warm white (2700K - 3000K) for cozy living room lounges, and neutral white (4000K) for workspaces.</li>
                <li><strong>CRI Rating:</strong> Select LED lights with a Color Rendering Index above 80 so natural textures appear vibrant.</li>
            </ul>

            <h4>Recommended Brands:</h4>
            <p>We stock energy-efficient spotlight lines and decorative LED strip panels from <strong>Philips</strong> and <strong>Anchor</strong> at wholesale prices.</p>
        `
    },
    "waterproofing-adhesives": {
        tag: "ADHESIVES & WATERPROOFING",
        title: "Tile Adhesives & Waterproofing Grouts",
        body: `
            <p><strong>Introduction:</strong> Installing large-format vitrified slabs and bathroom claddings requires modern polymer-modified adhesives instead of traditional cement mortar.</p>
            
            <h4>Why Cement Mortar Fails for Large Slabs:</h4>
            <ul>
                <li><strong>Shrinkage Cracks:</strong> Sand-cement mixtures shrink as they dry, causing tiles to crack or sound hollow.</li>
                <li><strong>Poor Adhesion to Vitrified Backs:</strong> Vitrified slabs have near-zero water absorption (&lt; 0.05%), meaning cement cannot mechanically anchor to them.</li>
                <li><strong>Water Ingress:</strong> Porous cement joints allow water to seep behind walls, destroying paint and adjacent rooms.</li>
            </ul>

            <h4>Key Recommendations:</h4>
            <p>Use high-tensile polymer adhesives (Type 2 / Type 3 certified) for slab bonding, and 100% solid epoxy waterproof grouts for joints. SGM stocks top adhesive brands from <strong>Laticrete</strong> and <strong>Roff</strong> with ready contractor bucket supply.</p>
        `
    }
};

const blogReaderModal = document.getElementById("blog-reader-modal");
const readerTag = document.getElementById("reader-tag");
const readerTitle = document.getElementById("reader-title");
const readerBody = document.getElementById("reader-body");
const blogReaderClose = document.getElementById("blog-reader-close");

function openBlogReader(articleId) {
    if (!blogReaderModal) return;
    
    const article = blogArticles[articleId];
    if (!article) return;
    
    readerTag.innerText = article.tag;
    readerTitle.innerText = article.title;
    readerBody.innerHTML = article.body;
    
    blogReaderModal.classList.add("show");
    document.body.style.overflow = "hidden";
}

function closeBlogReader() {
    if (blogReaderModal) {
        blogReaderModal.classList.remove("show");
        document.body.style.overflow = "auto";
    }
}

// Blog Cards open directly in new tab via href="article.html?id=..." target="_blank"
// Retain fallback modal capability if modal exists
if (blogReaderClose) {
    blogReaderClose.addEventListener("click", closeBlogReader);
}

if (blogReaderModal) {
    blogReaderModal.addEventListener("click", (e) => {
        if (e.target === blogReaderModal) {
            closeBlogReader();
        }
    });
}