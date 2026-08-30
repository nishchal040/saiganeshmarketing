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
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));
    
    slides[index].classList.add("active");
    if (dots[index]) dots[index].classList.add("active");
    current = index;
}

function nextSlide() {
    let next = (current + 1) % slides.length;
    showSlide(next);
}

function startSlider() {
    stopSlider();
    slideInterval = setInterval(nextSlide, 5000); // 5 seconds interval for luxury feel
}

// 2. Sticky Header Scroll Effect
window.addEventListener("scroll", () => {
    if (header) {
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }
});

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

// Trigger Form on Brochure Download click
if (downloadBrochureBtn) {
    downloadBrochureBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openForm();
    });
}

// Trigger Form load after 5 seconds
document.addEventListener("DOMContentLoaded", () => {
    // Start slider if exists
    if (slides.length > 0) {
        startSlider();
        
        dots.forEach(dot => {
            dot.addEventListener("click", (e) => {
                const slideIndex = parseInt(e.target.dataset.slide);
                showSlide(slideIndex);
                startSlider(); // Restart interval on user interaction
            });
        });
    }

    // Popup occurs ONLY ONCE and ONLY on the HOME PAGE
    const path = window.location.pathname.toLowerCase();
    const isHome = path.endsWith("index.html") || 
                   path === "/" || 
                   path.endsWith("/") || 
                   path === "" || 
                   (!path.includes("about.html") && !path.includes("services.html") && !path.includes("categories.html") && !path.includes("projects.html") && !path.includes("whychooseus.html") && !path.includes("blogs.html") && !path.includes("contactus.html") && !path.includes("article.html"));

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

    emailjs.send("service_wumsb9b", "template_k0zp5nd", {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        number: document.getElementById("number").value,
        category: document.getElementById("category").value,
        location: document.getElementById("area").value,
        message: document.getElementById("message").value
    })
    .then(function() {
        alert("Message Sent Successfully!");
        document.querySelector("form").reset();
        closeForm();
    }, function(error) {
        alert("Failed to send message. Please try again.");
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
const noCategoriesError = document.getElementById("no-categories-error");

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
        const cardTitle = card.querySelector("h3").innerText.toLowerCase();
        const cardBrands = card.dataset.brands.split(" ");
        
        const matchesSearch = searchTerm === "" || cardTitle.includes(searchTerm);
        const matchesBrand = activeBrandFilter === "all" || cardBrands.includes(activeBrandFilter);
        
        if (matchesSearch && matchesBrand) {
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

// Catalog PDFs Map
const catalogPdfs = {
    "Sanitaryware": [
        { title: "Cera Sanitaryware Bath Catalogue", size: "8.4 MB", file: "Cera_Sanitaryware_Catalog.pdf" },
        { title: "Somany Vitrified & Sanitary Closets Guide", size: "12.1 MB", file: "Somany_Sanitary_Guide.pdf" },
        { title: "Jaquar Luxury Bath Showers & Fittings", size: "16.8 MB", file: "Jaquar_Luxury_Fittings.pdf" }
    ],
    "Sanitaryware & Closets": [
        { title: "Cera Wall-Hung & Rimless Closets Catalog", size: "7.8 MB", file: "Cera_Rimless_Closets.pdf" },
        { title: "Somany Premium Sanitaryware Collection", size: "11.4 MB", file: "Somany_Sanitary_Guide.pdf" }
    ],
    "Designer Basins & Vanities": [
        { title: "Table-Top Vessel Sinks & Vanity Units", size: "6.5 MB", file: "Vanity_Basins_Catalog.pdf" },
        { title: "Kerovit Ceramic Countertop Basins", size: "8.1 MB", file: "Kerovit_Basins.pdf" }
    ],
    "Faucets, Mixers & Showers": [
        { title: "Jaquar PVD Brushed Gold Mixers & Taps", size: "14.2 MB", file: "Jaquar_Mixers_Showers.pdf" },
        { title: "Cera Thermostatic Rain Shower Columns", size: "9.3 MB", file: "Cera_Rain_Showers.pdf" }
    ],
    "Luxury Bath Suites": [
        { title: "Jaquar Artize Bespoke Master Bath Suites", size: "18.6 MB", file: "Jaquar_Artize_Suites.pdf" },
        { title: "Concealed Cisterns & LED Mirrors Guide", size: "5.7 MB", file: "Concealed_Cisterns_Guide.pdf" }
    ],
    "Sanitaryware Fixtures": [
        { title: "Commercial Sensor Urinals & Flush Valves", size: "6.9 MB", file: "Commercial_Sensors_Urinals.pdf" },
        { title: "Parryware Water-Saving Cisterns & Seats", size: "5.4 MB", file: "Parryware_Sanitary.pdf" }
    ],
    "Bathroom Accessories": [
        { title: "Solid Brass Towel Rails & Glass Shelves", size: "4.2 MB", file: "Brass_Bathroom_Accessories.pdf" },
        { title: "Health Faucets & Designer Robe Hooks", size: "3.8 MB", file: "Health_Faucets_Robe_Hooks.pdf" }
    ],
    "Tiles": [
        { title: "Somany Glazed Vitrified Tiles Catalog", size: "22.4 MB", file: "Somany_Vitrified_Tiles.pdf" },
        { title: "Kajaria Double Charge Floor Tiles Booklet", size: "18.3 MB", file: "Kajaria_Double_Charge.pdf" },
        { title: "Kerovit Designer Wall Claddings Brochure", size: "9.5 MB", file: "Kerovit_Wall_Tiles.pdf" }
    ],
    "Vitrified & Marble-Look Tiles": [
        { title: "Italian Marble Finish Glazed Vitrified Tiles", size: "21.6 MB", file: "Italian_Marble_Vitrified_Tiles.pdf" },
        { title: "Somany High-Gloss Floor Slabs 800x1600mm", size: "19.2 MB", file: "Somany_High_Gloss_Slabs.pdf" }
    ],
    "Floor & Wall Cladding Slabs": [
        { title: "Bookmatched Wall Claddings & Highlighter Slabs", size: "15.4 MB", file: "Wall_Cladding_Highlighters.pdf" },
        { title: "Living Room Polished Floor Slabs Catalog", size: "16.8 MB", file: "Living_Room_Flooring.pdf" }
    ],
    "Glazed Vitrified Display Slabs": [
        { title: "1200x2400mm Large Format Porcelain Slabs", size: "24.5 MB", file: "Large_Format_Slabs.pdf" },
        { title: "Kajaria Grandeur Slab Selection Guide", size: "20.1 MB", file: "Kajaria_Grandeur_Slabs.pdf" }
    ],
    "Tile Finishes & Swatches": [
        { title: "Matte, Satin & Wood-Grain Texture Swatches", size: "11.2 MB", file: "Tile_Textures_Swatches.pdf" },
        { title: "Anti-Fingerprint Surface Finishes Brochure", size: "8.7 MB", file: "Anti_Fingerprint_Surfaces.pdf" }
    ],
    "Porcelain & Outdoor Anti-Skid Tiles": [
        { title: "Heavy Duty Anti-Skid Parking & Paver Tiles", size: "13.8 MB", file: "Anti_Skid_Parking_Tiles.pdf" },
        { title: "Laticrete Epoxy Grouts & Adhesives Manual", size: "6.2 MB", file: "Epoxy_Grouts_Adhesives.pdf" }
    ],
    "Plumbing": [
        { title: "Prince CPVC Leak-Proof Pipelines Catalog", size: "7.1 MB", file: "Prince_CPVC_Pipes.pdf" },
        { title: "Ashirvad SWR Sewage Fittings Brochure", size: "8.6 MB", file: "Ashirvad_SWR_Pipes.pdf" }
    ],
    "CPVC & UPVC Piping Networks": [
        { title: "Ashirvad SDR-11 CPVC Hot & Cold Water Pipes", size: "9.4 MB", file: "Ashirvad_SDR11_CPVC.pdf" },
        { title: "Prince Acoustic SWR Noise-Free Drainage", size: "8.1 MB", file: "Prince_Acoustic_SWR.pdf" }
    ],
    "Industrial Plumbing & Drainage": [
        { title: "Sudhakar High-Diameter Effluent Pipelines", size: "12.3 MB", file: "Sudhakar_Industrial_Pipes.pdf" },
        { title: "16-Bar Pressure Rated Water Main Conduits", size: "10.5 MB", file: "Pressure_Pipes_16Bar.pdf" }
    ],
    "Plumbing Conduits & Valves": [
        { title: "Forged Brass Ball Valves & Pressure Regulators", size: "5.8 MB", file: "Brass_Ball_Valves.pdf" },
        { title: "Prince Heavy-Duty Riser Mains & Couplers", size: "7.6 MB", file: "Prince_Riser_Mains.pdf" }
    ],
    "Electrical": [
        { title: "Legrand Modular Switches & Frames Catalog", size: "6.2 MB", file: "Legrand_Modular_Switches.pdf" },
        { title: "Schneider Safety DB Breakers Brochure", size: "4.8 MB", file: "Schneider_Safety_DB.pdf" }
    ],
    "Electrical Switchgears & DB": [
        { title: "Schneider 4-Tier MCB Distribution Boards", size: "8.4 MB", file: "Schneider_DB_MCBs.pdf" },
        { title: "Legrand Arteor Luxury Glass Modular Switches", size: "7.2 MB", file: "Legrand_Arteor_Switches.pdf" }
    ],
    "Architectural Lighting & Fixtures": [
        { title: "Magnetic Track Spotlights & COB Downlights", size: "11.6 MB", file: "Magnetic_Track_Lighting.pdf" },
        { title: "Modern Showroom Pendant & Chandelier Lineup", size: "9.8 MB", file: "Pendant_Chandelier_Lineup.pdf" }
    ]
};

const catalogModal = document.getElementById("catalog-modal");
const catalogModalTitle = document.getElementById("catalog-modal-title");
const catalogModalTag = document.getElementById("catalog-modal-tag");
const catalogDownloadList = document.getElementById("catalog-download-list");
const catalogClose = document.getElementById("catalog-close");

function openCatalogModal(categoryName) {
    if (!catalogModal) return;
    
    catalogModalTitle.innerText = `${categoryName} Catalogs`;
    catalogModalTag.innerText = `${categoryName.toUpperCase()} CATALOGS`;
    
    // Clear and populate
    catalogDownloadList.innerHTML = "";
    
    // Look up exact or category fallback
    let pdfs = catalogPdfs[categoryName];
    if (!pdfs) {
        if (categoryName.toLowerCase().includes("sanitary") || categoryName.toLowerCase().includes("basin") || categoryName.toLowerCase().includes("faucet") || categoryName.toLowerCase().includes("bath")) {
            pdfs = catalogPdfs["Sanitaryware"];
        } else if (categoryName.toLowerCase().includes("tile") || categoryName.toLowerCase().includes("slab") || categoryName.toLowerCase().includes("floor")) {
            pdfs = catalogPdfs["Tiles"];
        } else if (categoryName.toLowerCase().includes("plumb") || categoryName.toLowerCase().includes("pipe") || categoryName.toLowerCase().includes("drain")) {
            pdfs = catalogPdfs["Plumbing"];
        } else {
            pdfs = catalogPdfs["Electrical"];
        }
    }
    
    if (pdfs) {
        pdfs.forEach(pdf => {
            const row = document.createElement("div");
            row.className = "catalog-pdf-row";
            row.innerHTML = `
                <div class="pdf-row-info">
                    <div class="pdf-row-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                            <polyline points="14 2 14 8 20 8"/>
                        </svg>
                    </div>
                    <div class="pdf-row-text">
                        <h5>${pdf.title}</h5>
                        <p>Format: PDF • Size: ${pdf.size}</p>
                    </div>
                </div>
                <a href="#" class="pdf-row-action" data-file="${pdf.file}">GET PDF <span class="arrow">↓</span></a>
            `;
            
            // Trigger contact modal first on clicking get PDF (leads collection)
            row.querySelector(".pdf-row-action").addEventListener("click", (e) => {
                e.preventDefault();
                closeCatalogModal();
                openForm();
            });
            
            catalogDownloadList.appendChild(row);
        });
    }
    
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
const blogCategoryFilters = document.querySelectorAll("input[name='blog-category-filter']");
const blogItemCards = document.querySelectorAll(".blog-item-card");
const noBlogsError = document.getElementById("no-blogs-error");

function filterBlogs() {
    if (blogItemCards.length === 0) return;
    
    const searchTerm = blogSearchInput ? blogSearchInput.value.toLowerCase().trim() : "";
    let activeCategory = "all";
    
    blogCategoryFilters.forEach(radio => {
        if (radio.checked) {
            activeCategory = radio.value;
        }
    });
    
    let visibleCount = 0;
    
    blogItemCards.forEach(card => {
        const cardTitle = card.querySelector("h3").innerText.toLowerCase();
        const cardSnippet = card.querySelector("p").innerText.toLowerCase();
        const cardCategory = card.dataset.category;
        
        const matchesSearch = searchTerm === "" || cardTitle.includes(searchTerm) || cardSnippet.includes(searchTerm);
        const matchesCategory = activeCategory === "all" || cardCategory === activeCategory;
        
        if (matchesSearch && matchesCategory) {
            card.style.display = "block";
            visibleCount++;
        } else {
            card.style.display = "none";
        }
    });
    
    if (noBlogsError) {
        noBlogsError.style.display = (visibleCount === 0) ? "block" : "none";
    }
}

// Bind blog search inputs
if (blogSearchInput) {
    blogSearchInput.addEventListener("input", filterBlogs);
}

// Bind blog categories list
if (blogCategoryFilters.length > 0) {
    blogCategoryFilters.forEach(radio => {
        radio.addEventListener("change", filterBlogs);
    });
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