document.addEventListener('DOMContentLoaded', () => {
    const cardGrid = document.getElementById('cardGrid');
    const searchInput = document.getElementById('searchInput');
    const classFilter = document.getElementById('classFilter');
    const databaseFilter = document.getElementById('databaseFilter');
    const bioactivityFilter = document.getElementById('bioactivityFilter');
    const scaffoldFilter = document.getElementById('scaffoldFilter'); // hidden input
    const activeScaffoldContainer = document.getElementById('activeScaffoldContainer');
    const activeScaffoldName = document.getElementById('activeScaffoldName');
    const clearScaffoldBtn = document.getElementById('clearScaffoldBtn');
    const scaffoldGallery = document.getElementById('scaffoldGallery');
    const collectionChips = document.getElementById('collectionChips');
    const resultsCounter = document.getElementById('resultsCounter');
    const loadMoreContainer = document.getElementById('loadMoreContainer');
    const loadMoreBtn = document.getElementById('loadMoreBtn');

    const resetBtn = document.getElementById('resetFilters');

    // LMW Filters Elements
    const mwSlider = document.getElementById('mwSlider');
    const logpSlider = document.getElementById('logpSlider');
    const tpsaSlider = document.getElementById('tpsaSlider');
    const mwMinLabel = document.getElementById('mwMinLabel');
    const mwMaxLabel = document.getElementById('mwMaxLabel');
    const logpMinLabel = document.getElementById('logpMinLabel');
    const logpMaxLabel = document.getElementById('logpMaxLabel');
    const tpsaMinLabel = document.getElementById('tpsaMinLabel');
    const tpsaMaxLabel = document.getElementById('tpsaMaxLabel');

    // Peptide Filters
    const tabLMW = document.getElementById('tabLMW');
    const tabPeptides = document.getElementById('tabPeptides');
    const lmwFilters = document.getElementById('lmwFilters');
    const peptideFilters = document.getElementById('peptideFilters');
    const lmwScaffoldGallery = document.getElementById('lmwScaffoldGallery');
    const peptideOriginGallery = document.getElementById('peptideOriginGallery');
    const pepOriginFilter = document.getElementById('pepOriginFilter');
    const lengthSlider = document.getElementById('lengthSlider');
    const piSlider = document.getElementById('piSlider');
    const piMinLabel = document.getElementById('piMinLabel');
    const piMaxLabel = document.getElementById('piMaxLabel');
    const lengthMinLabel = document.getElementById('lengthMinLabel');
    const lengthMaxLabel = document.getElementById('lengthMaxLabel');
    const resetPeptideFilters = document.getElementById('resetPeptideFilters');
    const chargeFilter = document.getElementById('chargeFilter');
    const pepBioactivityFilter = document.getElementById('pepBioactivityFilter');

    // Global slider instances
    let mwSliderInst, logpSliderInst, tpsaSliderInst, lengthSliderInst, piSliderInst;

    const allCompounds = (typeof compoundsData !== 'undefined') ? compoundsData.filter(c => c.smiles && c.smiles !== "") : [];
    const allPeptidesData = (typeof peptidesData !== 'undefined') ? peptidesData.filter(p => p.image && p.image !== "peptide_placeholder.svg") : [];
    
    let currentMode = 'lmw'; // 'lmw' or 'peptides'
    let currentFiltered = [];
    let currentPage = 1;
    const cardsPerPage = 50;
    let sortedScaffolds = [];

    if (allCompounds.length === 0) {
        console.error('No data found in compoundsData');
        cardGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: #94a3b8;">Error: No data loaded. Please check data.js.</p>';
        resultsCounter.textContent = '0 results';
    } else {
        const uniqueClasses = [...new Set(allCompounds.map(c => c.class).filter(c => c && c !== 'Unclassified'))].sort();
        uniqueClasses.forEach(c => {
            const option = document.createElement('option');
            option.value = c;
            option.textContent = c;
            classFilter.appendChild(option);
        });

        const uniqueDatabases = [...new Set(allCompounds.map(c => c.database).filter(c => c))].sort();
        uniqueDatabases.forEach(d => {
            // Add to dropdown
            const option = document.createElement('option');
            option.value = d;
            option.textContent = d;
            if (databaseFilter) databaseFilter.appendChild(option);

            // Create Chip
            const chip = document.createElement('button');
            chip.className = 'chip';
            chip.textContent = d;
            chip.addEventListener('click', () => {
                if (databaseFilter.value === d) {
                    databaseFilter.value = ''; // Toggle off
                } else {
                    databaseFilter.value = d; // Toggle on
                }
                filterData();
            });
            collectionChips.appendChild(chip);
        });

        // Bioactivity Filter Initialization
        const allActs = new Set();
        allCompounds.forEach(c => {
            if (c.bioactivities) {
                c.bioactivities.forEach(b => allActs.add(b));
            }
        });
        const uniqueActs = [...allActs].sort();
        uniqueActs.forEach(a => {
            const option = document.createElement('option');
            option.value = a;
            option.textContent = a;
            if (bioactivityFilter) bioactivityFilter.appendChild(option);
        });

        // Scaffold Filter Initialization (Horizontal Gallery)
        const scaffoldMap = {}; // Maps SMILES -> {count, id}
        allCompounds.forEach(c => {
            if (c.scaffold_smiles) {
                if(!scaffoldMap[c.scaffold_smiles]) {
                    scaffoldMap[c.scaffold_smiles] = { count: 0, id: c.scaffold_id };
                }
                scaffoldMap[c.scaffold_smiles].count++;
            }
        });
        
        sortedScaffolds = Object.keys(scaffoldMap).sort((a, b) => scaffoldMap[b].count - scaffoldMap[a].count);
        
        function getScaffoldHtml(s, index, isModal = false) {
            const isAcyclic = scaffoldMap[s].id === 'acyclic';
            const labelText = isAcyclic ? 'Acyclic / Linear' : `Framework #${index + 1}`;
            const className = isModal ? 'scaffold-card' : 'scaffold-item';
            
            return `
                <div class="${className}" data-smiles="${s}" title="${s}">
                    ${isAcyclic ? 
                        '<div style="height: 80px; display: flex; align-items: center; justify-content: center;"><svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11h10M4 11h1M19 11h1M7 7l-2 4 2 4M17 7l2 4-2 4"/></svg></div>' : 
                        `<canvas id="scaf_canvas_${isModal ? 'modal_' : ''}${index}" width="180" height="120" style="width: 100%; height: 80px;"></canvas>`
                    }
                    <div class="label" style="font-weight: 700; font-size: 0.7rem; color: var(--accent-color); margin-bottom: 2px;">${labelText}</div>
                    <div class="count">${scaffoldMap[s].count} compounds</div>
                </div>
            `;
        }

        function drawScaffoldCanvases(container, isModal = false) {
            container.querySelectorAll(isModal ? '.scaffold-card' : '.scaffold-item').forEach((item, index) => {
                const smiles = item.getAttribute('data-smiles');
                const canvas = item.querySelector('canvas');
                if (canvas && smiles && smiles !== 'Acyclic') {
                    SmilesDrawer.parse(smiles, tree => {
                        smilesDrawer.draw(tree, canvas.id, 'light', false);
                    });
                }
            });
        }

        if(scaffoldGallery) {
            const topScaffolds = sortedScaffolds.slice(0, 40);
            topScaffolds.forEach((s, index) => {
                scaffoldGallery.insertAdjacentHTML('beforeend', getScaffoldHtml(s, index));
            });
            drawScaffoldCanvases(scaffoldGallery);
            
            // Add click listeners to gallery items (needs to be done after injection)
            const addGalleryListeners = (container) => {
                container.querySelectorAll('.scaffold-item, .scaffold-card').forEach(item => {
                    item.addEventListener('click', () => {
                        const sm = item.getAttribute('data-smiles');
                        if (scaffoldFilter.value === sm) {
                            scaffoldFilter.value = '';
                            document.querySelectorAll('.scaffold-item, .scaffold-card').forEach(i => i.classList.remove('active'));
                            if(activeScaffoldContainer) activeScaffoldContainer.style.display = 'none';
                        } else {
                            document.querySelectorAll('.scaffold-item, .scaffold-card').forEach(i => i.classList.remove('active'));
                            scaffoldFilter.value = sm;
                            item.classList.add('active');
                            if(activeScaffoldContainer) activeScaffoldContainer.style.display = 'block';
                            const isAcyclicS = sm === 'Acyclic' || sm === '';
                            const rank = sortedScaffolds.indexOf(sm) + 1;
                            if(activeScaffoldName) activeScaffoldName.textContent = isAcyclicS ? 'Acyclic' : `Framework #${rank}`;
                            
                            // Scroll to results automatically for better functionality
                            setTimeout(() => {
                                resultsCounter.scrollIntoView({ behavior: 'smooth', block: 'start' });
                            }, 100);
                        }
                        filterData();
                        // If in modal, close it
                        if(scaffoldModal && scaffoldModal.style.display === 'block') scaffoldModal.style.display = 'none';
                    });
                });
            };
            
            addGalleryListeners(scaffoldGallery);

            // Scroll Navigation
            const scrollLeftBtn = document.getElementById('scrollLeftBtn');
            const scrollRightBtn = document.getElementById('scrollRightBtn');
            if(scrollLeftBtn) scrollLeftBtn.addEventListener('click', () => scaffoldGallery.scrollBy({left: -400, behavior: 'smooth'}));
            if(scrollRightBtn) scrollRightBtn.addEventListener('click', () => scaffoldGallery.scrollBy({left: 400, behavior: 'smooth'}));
            
            // "View All" Modal Logic
            const viewAllBtn = document.getElementById('viewAllScaffoldsBtn');
            const scaffoldModal = document.getElementById('scaffoldModal');
            const scaffoldGrid = document.getElementById('scaffoldGrid');
            const closeScaffoldBtn = document.getElementById('closeScaffoldModal');
            
            if(viewAllBtn && scaffoldModal && scaffoldGrid) {
                viewAllBtn.addEventListener('click', () => {
                    scaffoldGrid.innerHTML = '';
                    sortedScaffolds.forEach((s, index) => {
                        scaffoldGrid.insertAdjacentHTML('beforeend', getScaffoldHtml(s, index, true));
                    });
                    addGalleryListeners(scaffoldGrid);
                    drawScaffoldCanvases(scaffoldGrid, true);
                    scaffoldModal.style.display = 'block';
                });
                
                if(closeScaffoldBtn) closeScaffoldBtn.addEventListener('click', () => scaffoldModal.style.display = 'none');
                window.addEventListener('click', (e) => { if(e.target === scaffoldModal) scaffoldModal.style.display = 'none'; });
            }
        }
        
        if(clearScaffoldBtn) clearScaffoldBtn.addEventListener('click', () => {
            scaffoldFilter.value = '';
            scaffoldGallery.querySelectorAll('.scaffold-item').forEach(i => i.classList.remove('active'));
            activeScaffoldContainer.style.display = 'none';
            filterData();
        });

        // LMW Range Sliders Initialization
        if (mwSlider) {
            mwSliderInst = noUiSlider.create(mwSlider, {
                start: [0, 2000], connect: true,
                range: { 'min': 0, 'max': 2000 }, step: 10
            });
            mwSliderInst.on('update', (vals) => {
                mwMinLabel.textContent = Math.round(vals[0]);
                mwMaxLabel.textContent = Math.round(vals[1]);
                filterData();
            });
        }
        if (logpSlider) {
            logpSliderInst = noUiSlider.create(logpSlider, {
                start: [-6, 20], connect: true,
                range: { 'min': -6, 'max': 20 }, step: 0.1
            });
            logpSliderInst.on('update', (vals) => {
                logpMinLabel.textContent = vals[0];
                logpMaxLabel.textContent = vals[1];
                filterData();
            });
        }
        if (tpsaSlider) {
            tpsaSliderInst = noUiSlider.create(tpsaSlider, {
                start: [0, 1000], connect: true,
                range: { 'min': 0, 'max': 1000 }, step: 10
            });
            tpsaSliderInst.on('update', (vals) => {
                tpsaMinLabel.textContent = Math.round(vals[0]);
                tpsaMaxLabel.textContent = Math.round(vals[1]);
                filterData();
            });
        }

        // Toggle Mode Logic
        if (tabLMW && tabPeptides) {
            tabLMW.addEventListener('click', () => {
                currentMode = 'lmw';
                tabLMW.classList.add('active');
                tabPeptides.classList.remove('active');
                lmwFilters.style.display = 'flex';
                peptideFilters.style.display = 'none';
                lmwScaffoldGallery.style.display = 'block';
                peptideOriginGallery.style.display = 'none';
                collectionChips.style.visibility = 'visible';
                filterData();
            });

            tabPeptides.addEventListener('click', () => {
                currentMode = 'peptides';
                tabPeptides.classList.add('active');
                tabLMW.classList.remove('active');
                lmwFilters.style.display = 'none';
                peptideFilters.style.display = 'flex';
                lmwScaffoldGallery.style.display = 'none';
                peptideOriginGallery.style.display = 'block';
                collectionChips.style.visibility = 'hidden';
                filterData();
            });
        }

        // Initialize Peptide Specific Filters
        if (allPeptidesData.length > 0) {
            const uniquePepOrigins = [...new Set(allPeptidesData.map(p => p.origin))].sort();
            uniquePepOrigins.forEach(o => {
                const opt = document.createElement('option');
                opt.value = o;
                opt.textContent = o;
                if (pepOriginFilter) pepOriginFilter.appendChild(opt);
            });

            // Peptide Bioactivity Filter Initialization
            const allPepActs = new Set();
            allPeptidesData.forEach(p => {
                if (p.bioactivities) {
                    p.bioactivities.forEach(a => allPepActs.add(a));
                }
            });
            [...allPepActs].sort().forEach(a => {
                const opt = document.createElement('option');
                opt.value = a;
                opt.textContent = a;
                if (pepBioactivityFilter) pepBioactivityFilter.appendChild(opt);
            });

            if (lengthSlider) {
                lengthSliderInst = noUiSlider.create(lengthSlider, {
                    start: [2, 50],
                    connect: true,
                    range: { 'min': 2, 'max': 50 },
                    step: 1
                });
                lengthSliderInst.on('update', (values) => {
                    lengthMinLabel.textContent = Math.round(values[0]);
                    lengthMaxLabel.textContent = Math.round(values[1]);
                    filterData();
                });
            }

            if (piSlider) {
                piSliderInst = noUiSlider.create(piSlider, {
                    start: [0, 14],
                    connect: true,
                    range: { 'min': 0, 'max': 14 },
                    step: 0.1
                });
                piSliderInst.on('update', (values) => {
                    piMinLabel.textContent = values[0];
                    piMaxLabel.textContent = values[1];
                    filterData();
                });
            }
        }

        filterData(); // Initial load
    }

    function filterData() {
        const searchTerm = searchInput.value.toLowerCase();
        
        if (currentMode === 'lmw') {
            const selectedClass = classFilter ? classFilter.value : '';
            const selectedDatabase = databaseFilter ? databaseFilter.value : '';
            const selectedBioactivity = bioactivityFilter ? bioactivityFilter.value : '';
            const selectedScaffold = scaffoldFilter ? scaffoldFilter.value : '';

            // Sync chips UI
            document.querySelectorAll('.chip').forEach(chip => {
                if (chip.textContent === selectedDatabase) chip.classList.add('active');
                else chip.classList.remove('active');
            });

            const mw_values = mwSliderInst ? mwSliderInst.get() : [0, 2000];
            const logp_values = logpSliderInst ? logpSliderInst.get() : [-6, 20];
            const tpsa_values = tpsaSliderInst ? tpsaSliderInst.get() : [0, 1000];

            const mw_min = parseFloat(mw_values[0]);
            const mw_max = parseFloat(mw_values[1]);
            const logp_min = parseFloat(logp_values[0]);
            const logp_max = parseFloat(logp_values[1]);
            const tpsa_min = parseFloat(tpsa_values[0]);
            const tpsa_max = parseFloat(tpsa_values[1]);

            currentFiltered = allCompounds.filter(compound => {
                const textMatch = (
                    compound.name.toLowerCase().includes(searchTerm) ||
                    compound.class.toLowerCase().includes(searchTerm) ||
                    compound.molecular_formula.toLowerCase().includes(searchTerm)
                );

                const classMatch = !selectedClass || compound.class === selectedClass;
                const databaseMatch = !selectedDatabase || compound.database === selectedDatabase;
                const bioMatch = !selectedBioactivity || (compound.bioactivities && compound.bioactivities.includes(selectedBioactivity));
                const scaffoldMatch = !selectedScaffold || compound.scaffold_smiles === selectedScaffold;

                const mwMatch = compound.mw >= mw_min && compound.mw <= mw_max;
                const logpMatch = compound.logp >= logp_min && compound.logp <= logp_max;
                const tpsaMatch = compound.tpsa >= tpsa_min && compound.tpsa <= tpsa_max;

                return textMatch && classMatch && databaseMatch && bioMatch && scaffoldMatch && mwMatch && logpMatch && tpsaMatch;
            });
        } else {
            // Peptide Filtering Logic
            const selectedPepOrigin = pepOriginFilter ? pepOriginFilter.value : '';
            const selectedCharge = chargeFilter ? chargeFilter.value : '';
            const selectedPepBio = pepBioactivityFilter ? pepBioactivityFilter.value : '';
            
            const len_values = lengthSliderInst ? lengthSliderInst.get() : [2, 50];
            const pi_values = piSliderInst ? piSliderInst.get() : [0, 14];
            
            const len_min = parseInt(len_values[0]);
            const len_max = parseInt(len_values[1]);
            const pi_min = parseFloat(pi_values[0]);
            const pi_max = parseFloat(pi_values[1]);

            currentFiltered = allPeptidesData.filter(pep => {
                const textMatch = (
                    pep.name.toLowerCase().includes(searchTerm) ||
                    pep.sequence.toLowerCase().includes(searchTerm) ||
                    pep.origin.toLowerCase().includes(searchTerm)
                );
                
                const originMatch = !selectedPepOrigin || pep.origin === selectedPepOrigin;
                const bioMatch = !selectedPepBio || (pep.bioactivities && pep.bioactivities.includes(selectedPepBio));
                const lenMatch = pep.length >= len_min && pep.length <= len_max;
                const piMatch = pep.pi >= pi_min && pep.pi <= pi_max;
                
                let chargeMatch = true;
                if (selectedCharge === 'positive') chargeMatch = pep.pi > 7.5;
                if (selectedCharge === 'neutral') chargeMatch = pep.pi >= 6.5 && pep.pi <= 7.5;
                if (selectedCharge === 'negative') chargeMatch = pep.pi < 6.5;

                return textMatch && originMatch && bioMatch && lenMatch && piMatch && chargeMatch;
            });
        }

        currentPage = 1;
        renderCards(currentFiltered, true);
    }

    const inputs = [searchInput, classFilter, databaseFilter, bioactivityFilter, scaffoldFilter, pepOriginFilter, chargeFilter, pepBioactivityFilter];
    inputs.forEach(input => {
        if(input) input.addEventListener('input', filterData);
        if(input && input.tagName === 'SELECT') input.addEventListener('change', filterData);
    });

    resetBtn.addEventListener('click', () => {
        if(searchInput) searchInput.value = '';
        if(classFilter) classFilter.value = '';
        if(databaseFilter) databaseFilter.value = '';
        if(bioactivityFilter) bioactivityFilter.value = '';
        if(scaffoldFilter) scaffoldFilter.value = '';
        if(scaffoldGallery) scaffoldGallery.querySelectorAll('.scaffold-item').forEach(i => i.classList.remove('active'));
        if(activeScaffoldContainer) activeScaffoldContainer.style.display = 'none';
        
        if (mwSliderInst) mwSliderInst.set([0, 2000]);
        if (logpSliderInst) logpSliderInst.set([-6, 20]);
        if (tpsaSliderInst) tpsaSliderInst.set([0, 1000]);
        
        filterData();
    });

    if (resetPeptideFilters) {
        resetPeptideFilters.addEventListener('click', () => {
            if(searchInput) searchInput.value = '';
            if(pepOriginFilter) pepOriginFilter.value = '';
            if(chargeFilter) chargeFilter.value = '';
            if(pepBioactivityFilter) pepBioactivityFilter.value = '';
            if(lengthSliderInst) lengthSliderInst.set([2, 50]);
            if(piSliderInst) piSliderInst.set([0, 14]);
            filterData();
        });
    }

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderCards(currentFiltered, false);
    });

    function renderCards(compounds, reset = true) {
        if (reset) cardGrid.innerHTML = '';

        const totalFiltered = compounds.length;
        const maxShown = Math.min(currentPage * cardsPerPage, totalFiltered);
        
        if (totalFiltered === 0) {
            resultsCounter.textContent = `Showing 0 results`;
            cardGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1; color: #94a3b8;">No compounds found matching your search.</p>';
            loadMoreContainer.style.display = 'none';
            return;
        }

        resultsCounter.textContent = `Showing ${maxShown} of ${totalFiltered} results (from ${currentMode === 'lmw' ? allCompounds.length : allPeptidesData.length} total ${currentMode === 'lmw' ? 'compounds' : 'peptides'})`;

        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        const paginated = compounds.slice(startIndex, endIndex);

        paginated.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';

            if (currentMode === 'lmw') {
                const displayName = item.name.length > 25 ? item.name.substring(0, 22) + '...' : item.name;
                let refHtml = item.referencias || 'N/A';
                if (refHtml !== 'N/A') {
                    const trimmedRef = refHtml.trim();
                    if (trimmedRef.startsWith('http')) {
                        refHtml = `<a href="${trimmedRef}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: none; font-weight: 500;">Article Link ↗</a>`;
                    } else if (trimmedRef.startsWith('10.')) {
                        refHtml = `<a href="https://doi.org/${trimmedRef}" target="_blank" rel="noopener noreferrer" style="color: var(--accent-color); text-decoration: none; font-weight: 500;">DOI ↗</a>`;
                    }
                }

                card.innerHTML = `
                    <div class="card-image" style="position: relative;">
                        ${item.class && item.class !== 'Unclassified' ? `<span class="tag" style="position: absolute; top: 1rem; left: 1rem; margin: 0; background-color: rgba(56, 189, 248, 0.9); color: white; padding: 0.25rem 0.5rem; text-shadow: 0 1px 2px rgba(0,0,0,0.1); border-radius: 0.25rem; z-index: 10;">${item.class}</span>` : ''}
                        <canvas id="mol_canvas_${item.id}" width="400" height="300" style="width: 100%; height: auto; padding: 20px;"></canvas>
                    </div>
                    <div class="card-content">
                        <h2 class="card-title" title="${item.name}">${displayName}</h2>
                        <div class="card-property"><span class="label">ID</span><span>${item.id}</span></div>
                        <div class="card-property"><span class="label">Molecular Formula</span><span>${item.molecular_formula}</span></div>

                        <details style="margin-top: 0.5rem; padding: 0.4rem; background: rgba(0,0,0,0.02); border-radius: 6px; border: 1px solid var(--card-border);">
                            <summary class="label" style="cursor: pointer; outline: none; font-size: 0.65rem; color: var(--accent-color); font-weight: 600; display: block; margin: 0;">Show SMILES ▼</summary>
                            <div style="display: flex; align-items: flex-start; gap: 0.5rem; justify-content: space-between; margin-top: 0.5rem;">
                                <span class="smiles-text" title="${item.smiles}" style="margin: 0; word-break: break-all; text-align: left;">${item.smiles}</span>
                                <button class="copy-btn" onclick="navigator.clipboard.writeText('${item.smiles}').then(() => {let tmp=this.innerHTML; this.innerHTML='Copied!'; setTimeout(()=>this.innerHTML=tmp, 1500)})" style="background: none; border: 1px solid var(--card-border); border-radius: 4px; padding: 2px 6px; cursor: pointer; color: var(--accent-color); font-size: 0.7rem; transition: background 0.3s; flex-shrink: 0;">Copy</button>
                            </div>
                        </details>

                        <details style="margin-top: 0.5rem; padding: 0.4rem; background: rgba(0,0,0,0.02); border-radius: 6px; border: 1px solid var(--card-border);">
                            <summary class="label" style="cursor: pointer; outline: none; font-size: 0.65rem; color: var(--accent-color); font-weight: 600; display: block; margin: 0;">Show Reference ▼</summary>
                            <div style="font-size: 0.65rem; color: #475569; text-align: left; word-break: break-word; margin-top: 0.5rem; line-height: 1.4;">${refHtml}</div>
                        </details>

                        ${item.bioactivities ? `
                        <div class="card-property" style="margin-top: 0.5rem; align-items: flex-start;">
                            <span class="label">Bioactivity</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; justify-content: flex-end; max-width: 70%;">
                                ${item.bioactivities.map(b => `<span style="font-size: 0.6rem; background: rgba(234, 88, 12, 0.1); border: 1px solid rgba(234, 88, 12, 0.2); color: var(--accent-color); padding: 0.1rem 0.3rem; border-radius: 4px; display: inline-block;">${b}</span>`).join('')}
                            </div>
                        </div>` : ''}

                        <div class="card-stats" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.25rem; margin: 1rem 0; text-align: center; border-top: 1px solid rgba(148, 163, 184, 0.1); padding-top: 0.5rem;">
                            <div class="stat-item"><span class="label" style="display:block; font-size: 0.65rem;">MW</span><span class="value" style="font-weight: 600; color: #38bdf8; font-size: 0.8rem;">${item.mw}</span></div>
                            <div class="stat-item"><span class="label" style="display:block; font-size: 0.65rem;">Log<i>P</i></span><span class="value" style="font-weight: 600; color: #818cf8; font-size: 0.8rem;">${item.logp}</span></div>
                            <div class="stat-item"><span class="label" style="display:block; font-size: 0.65rem;">TPSA</span><span class="value" style="font-weight: 600; color: #38bdf8; font-size: 0.8rem;">${item.tpsa}</span></div>
                            <div class="stat-item"><span class="label" style="display:block; font-size: 0.65rem;">HBD</span><span class="value" style="font-weight: 600; color: #34d399; font-size: 0.8rem;">${item.hbd}</span></div>
                            <div class="stat-item"><span class="label" style="display:block; font-size: 0.65rem;">HBA</span><span class="value" style="font-weight: 600; color: #34d399; font-size: 0.8rem;">${item.hba}</span></div>
                        </div>
                        <div class="card-actions">
                            <a href="assets/sdf/${item.sdf}" download="${item.sdf}" class="download-btn">Download SDF</a>
                        </div>
                    </div>
                `;
            } else {
                // Peptide Card Rendering
                const aaMap = {
                    'A': 'nonpolar', 'G': 'nonpolar', 'V': 'nonpolar', 'L': 'nonpolar', 'I': 'nonpolar', 'M': 'nonpolar', 'P': 'nonpolar',
                    'S': 'polar', 'T': 'polar', 'C': 'polar', 'N': 'polar', 'Q': 'polar',
                    'D': 'acidic', 'E': 'acidic',
                    'K': 'basic', 'R': 'basic', 'H': 'basic',
                    'F': 'aromatic', 'W': 'aromatic', 'Y': 'aromatic'
                };
                
                const aaHtml = item.sequence.split('').map(char => {
                    const type = aaMap[char] || 'nonpolar';
                    return `<div class="aa-char aa-${type}" title="${char}">${char}</div>`;
                }).join('');

                let pepRefHtml = item.referencias || 'N/A';
                if (pepRefHtml !== 'N/A') {
                    const trimmedRef = pepRefHtml.trim();
                    if (trimmedRef.startsWith('http')) {
                        pepRefHtml = `<a href="${trimmedRef}" target="_blank" rel="noopener noreferrer" style="color: #0369a1; text-decoration: none; font-weight: 500;">Article Link ↗</a>`;
                    } else if (trimmedRef.startsWith('10.')) {
                        pepRefHtml = `<a href="https://doi.org/${trimmedRef}" target="_blank" rel="noopener noreferrer" style="color: #0369a1; text-decoration: none; font-weight: 500;">DOI ↗</a>`;
                    }
                }

                card.innerHTML = `
                    <div class="card-image" style="position: relative;">
                        <span class="tag" style="position: absolute; top: 1rem; left: 1rem; background: #0369a1;">${item.origin}</span>
                        <img src="assets/images/${item.image}" alt="${item.name}" loading="lazy" onerror="this.src='assets/images/peptide_placeholder.svg'">
                         <div style="position: absolute; bottom: 1rem; display: flex; gap: 5px; width: 100%; justify-content: center;">
                            ${aaHtml}
                        </div>
                    </div>
                    <div class="card-content">
                        <h2 class="card-title">${item.name}</h2>
                        <div class="card-property"><span class="label">ID</span><span>${item.id}</span></div>
                        <div class="card-property"><span class="label">Length</span><span>${item.length} AA</span></div>
                        
                        <div class="peptide-sequence">${item.sequence}</div>
                        
                        <div style="display: flex; gap: 5px; margin-bottom: 1rem; flex-wrap: wrap;">
                            <span class="peptide-badge">pI: ${item.pi}</span>
                            <span class="peptide-badge">MW: ${item.mw}</span>
                            <span class="peptide-badge">Hydro: ${item.hydrophobicity}</span>
                        </div>

                        <details style="margin-top: 0.5rem; padding: 0.4rem; background: rgba(3, 105, 161, 0.02); border-radius: 6px; border: 1px solid rgba(3, 105, 161, 0.1);">
                            <summary class="label" style="cursor: pointer; outline: none; font-size: 0.65rem; color: #0369a1; font-weight: 600; display: block; margin: 0;">Show Reference ▼</summary>
                            <div style="font-size: 0.65rem; color: #475569; text-align: left; word-break: break-word; margin-top: 0.5rem; line-height: 1.4;">${pepRefHtml}</div>
                        </details>

                        <div class="card-property" style="margin-top: 0.5rem; align-items: flex-start;">
                            <span class="label">Bioactivity</span>
                            <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; justify-content: flex-end;">
                                ${item.bioactivities.map(b => `<span style="font-size: 0.6rem; background: rgba(3, 105, 161, 0.1); color: #0369a1; padding: 0.1rem 0.3rem; border-radius: 4px; border: 1px solid rgba(3, 105, 161, 0.2);">${b}</span>`).join('')}
                            </div>
                        </div>

                        <p style="font-size: 0.75rem; color: #64748b; margin-top: 1rem; font-style: italic;">${item.description}</p>
                        
                        <div class="card-footer">
                            <button class="download-btn" onclick="alert('FASTA format coming soon!')">Download FASTA</button>
                        </div>
                    </div>
                `;
            }
            cardGrid.appendChild(card);
            
            // Draw SMILES to canvas
            if (currentMode === 'lmw' && item.smiles) {
                setTimeout(() => {
                    const canvasId = `mol_canvas_${item.id}`;
                    SmilesDrawer.parse(item.smiles, tree => {
                        smilesDrawer.draw(tree, canvasId, 'light', false);
                    });
                }, 0);
            }
        });

        if (endIndex >= totalFiltered) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'block';
        }
    }

    // Analytics Dashboard
    const analyticsBtn = document.getElementById('analyticsBtn');
    const analyticsHeaderBtn = document.getElementById('analyticsHeaderBtn');
    const analyticsModal = document.getElementById('analyticsModal');
    const closeAnalytics = document.getElementById('closeAnalytics');
    let charts = {};

    function openAnalyticsDashboard() {
        analyticsModal.style.display = 'block';
        generateCharts();
    }

    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', openAnalyticsDashboard);
    }
    
    if (analyticsHeaderBtn) {
        analyticsHeaderBtn.addEventListener('click', openAnalyticsDashboard);
    }

    closeAnalytics.addEventListener('click', () => {
        analyticsModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === analyticsModal) {
            analyticsModal.style.display = 'none';
        }
        if (event.target === citeUsModal) {
            citeUsModal.style.display = 'none';
        }
    });

    // Cite Us Modal
    const citeUsBtn = document.getElementById('citeUsBtn');
    const citeUsModal = document.getElementById('citeUsModal');
    const closeCiteUs = document.getElementById('closeCiteUs');

    if (citeUsBtn && citeUsModal && closeCiteUs) {
        citeUsBtn.addEventListener('click', () => {
            citeUsModal.style.display = 'block';
        });

        closeCiteUs.addEventListener('click', () => {
            citeUsModal.style.display = 'none';
        });
    }

    // Intercept Analytics clicks from Top Navbar
    // If you trigger model through html onclick it is already covered.

    // Also we should generate charts when analytics modal is manually opened.
    // The top navbar triggers `document.getElementById('analyticsModal').style.display='block';`
    // We can add a mutation observer or just re-generate charts periodically.
    // It's easier to expose a global function:
    window.openAnalytics = function() {
        document.getElementById('analyticsModal').style.display = 'block';
        generateCharts();
    }
    
    // Quick overwrite the html link behavior for analytics
    const analyticsNavLinks = document.querySelectorAll('.nav-links a');
    analyticsNavLinks.forEach(link => {
        if(link.textContent === 'Analytics') {
            link.onclick = (e) => {
                e.preventDefault();
                window.openAnalytics();
            }
        }
    });

    function generateCharts() {
        if (!allCompounds.length) return;

        const destroyChart = (id) => {
            if (charts[id]) {
                charts[id].destroy();
            }
        };

        const classCounts = {};
        allCompounds.forEach(c => {
            classCounts[c.class] = (classCounts[c.class] || 0) + 1;
        });

        destroyChart('classChart');
        charts['classChart'] = new Chart(document.getElementById('classChart'), {
            type: 'doughnut',
            data: {
                labels: Object.keys(classCounts),
                datasets: [{
                    data: Object.values(classCounts),
                    backgroundColor: [
                        '#ea580c', '#c2410c', '#f97316', '#fb923c', '#4b5563', '#374151', '#9ca3af', '#fdba74'
                    ],
                    borderWidth: 0
                }]
            },
            options: { responsive: true, plugins: { legend: { position: 'right', labels: { color: '#64748b' } } } }
        });

        const getHistogramData = (property, binSize) => {
            const values = allCompounds.map(c => c[property]);
            const min = Math.floor(Math.min(...values) / binSize) * binSize;
            const max = Math.ceil(Math.max(...values) / binSize) * binSize;
            const bins = {};

            for (let i = min; i < max; i += binSize) { bins[i] = 0; }
            values.forEach(v => {
                const bin = Math.floor(v / binSize) * binSize;
                if (bins[bin] !== undefined) bins[bin]++;
            });

            return {
                labels: Object.keys(bins).map(k => `${k}-${parseInt(k) + binSize}`),
                data: Object.values(bins)
            };
        };

        const mwData = getHistogramData('mw', 50);
        destroyChart('mwChart');
        charts['mwChart'] = new Chart(document.getElementById('mwChart'), {
            type: 'bar',
            data: { labels: mwData.labels, datasets: [{ label: 'Count', data: mwData.data, backgroundColor: '#ea580c', borderRadius: 4 }] },
            options: { responsive: true, scales: { x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.2)' } }, y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.2)' } } }, plugins: { legend: { display: false } } }
        });

        const logpData = getHistogramData('logp', 1);
        destroyChart('logpChart');
        charts['logpChart'] = new Chart(document.getElementById('logpChart'), {
            type: 'bar',
            data: { labels: logpData.labels, datasets: [{ label: 'Count', data: logpData.data, backgroundColor: '#4b5563', borderRadius: 4 }] },
            options: { responsive: true, scales: { x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.2)' } }, y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.2)' } } }, plugins: { legend: { display: false } } }
        });

        const tpsaData = getHistogramData('tpsa', 20);
        destroyChart('tpsaChart');
        charts['tpsaChart'] = new Chart(document.getElementById('tpsaChart'), {
            type: 'bar',
            data: { labels: tpsaData.labels, datasets: [{ label: 'Count', data: tpsaData.data, backgroundColor: '#f97316', borderRadius: 4 }] },
            options: { responsive: true, scales: { x: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.2)' } }, y: { ticks: { color: '#64748b' }, grid: { color: 'rgba(148, 163, 184, 0.2)' } } }, plugins: { legend: { display: false } } }
        });
    }

    // --- Network Analysis Implementation ---
    const networkModal = document.getElementById('networkModal');
    const closeNetwork = document.getElementById('closeNetwork');
    const navNetworkAnalysis = document.getElementById('navNetworkAnalysis');
    const networkHeaderBtn = document.getElementById('networkHeaderBtn');
    const networkSvg = d3.select('#networkSvg');
    const networkTooltip = document.getElementById('networkTooltip');
    const networkDatabaseFilter = document.getElementById('networkDatabaseFilter');
    const networkGroupSelect = document.getElementById('networkGroupSelect');
    const minEdgeWeightInput = document.getElementById('minEdgeWeight');
    const minEdgeWeightVal = document.getElementById('minEdgeWeightVal');
    const toggleNetworkLabels = document.getElementById('toggleNetworkLabels');
    const toggleSPD = document.getElementById('toggleSPD');
    const runClusteringBtn = document.getElementById('runClustering');
    const togglePCALayout = document.getElementById('togglePCALayout');
    const resetNetworkLayoutBtn = document.getElementById('resetNetworkLayout');
    const targetNodeLegend = document.getElementById('targetNodeLegend');

    let simulation;

    function openNetwork() {
        if (!networkModal) return;
        networkModal.style.display = 'block';
        setTimeout(initNetwork, 100);
    }

    if (navNetworkAnalysis) navNetworkAnalysis.onclick = (e) => { e.preventDefault(); openNetwork(); };
    if (networkHeaderBtn) networkHeaderBtn.onclick = openNetwork;
    if (closeNetwork) closeNetwork.onclick = () => networkModal.style.display = 'none';

    window.addEventListener('click', (e) => {
        if (e.target === networkModal) networkModal.style.display = 'none';
    });

    if (networkDatabaseFilter) networkDatabaseFilter.onchange = initNetwork;
    if (networkGroupSelect) networkGroupSelect.onchange = initNetwork;
    if (minEdgeWeightInput) {
        minEdgeWeightInput.oninput = (e) => {
            minEdgeWeightVal.textContent = e.target.value;
            initNetwork();
        };
    }
    if (resetNetworkLayoutBtn) resetNetworkLayoutBtn.onclick = () => {
        if(simulation) {
            simulation.alpha(1).restart();
            simulation.force('link').strength(0.3);
            simulation.force('charge').strength(-300);
            simulation.nodes().forEach(n => { n.fx = null; n.fy = null; });
        }
    };

    if (togglePCALayout) {
        togglePCALayout.onclick = () => {
            const nodes = simulation.nodes().filter(n => n.type === 'scaffold');
            if (nodes.length < 3) return;

            // 1. Collect features for each scaffold node
            // Since we don't have all specs on the node, we fetch from allCompounds
            const features = nodes.map(n => {
                const comp = allCompounds.find(c => c.scaffold_smiles === n.smiles);
                return [comp.mw, comp.logp, comp.tpsa, comp.hbd, comp.hba];
            });

            // 2. Perform simple PCA
            const pcs = computePCA(features);
            
            // 3. Update positions
            const container = document.getElementById('networkContainer');
            const w = container.clientWidth;
            const h = container.clientHeight;
            const padding = 100;

            simulation.stop();
            
            nodes.forEach((n, i) => {
                const pc1 = pcs[i][0];
                const pc2 = pcs[i][1];
                
                // Scale to fit container
                n.fx = (pc1 * (w - padding*2)) + w/2;
                n.fy = (pc2 * (h - padding*2)) + h/2;
            });

            // Trigger a final tick to update visuals
            simulation.tick();
            networkSvg.select('g').selectAll('g').transition().duration(750)
                .attr('transform', d => `translate(${d.x},${d.y})`);
            networkSvg.select('g').selectAll('line').transition().duration(750)
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);
        };
    }

    function computePCA(matrix) {
        const rows = matrix.length;
        const cols = matrix[0].length;

        // Mean Centering & Scaling
        const means = new Array(cols).fill(0);
        const stds = new Array(cols).fill(0);
        for (let j = 0; j < cols; j++) {
            for (let i = 0; i < rows; i++) means[j] += matrix[i][j];
            means[j] /= rows;
            for (let i = 0; i < rows; i++) stds[j] += Math.pow(matrix[i][j] - means[j], 2);
            stds[j] = Math.sqrt(stds[j] / rows) || 1;
        }

        const normalized = matrix.map(row => row.map((val, j) => (val - means[j]) / stds[j]));

        // Simple Power Iteration for first 2 PCs
        const getPC = (data, iterations = 50) => {
            let eigenvector = new Array(cols).fill(0).map(() => Math.random());
            for (let iter = 0; iter < iterations; iter++) {
                let nextV = new Array(cols).fill(0);
                for (let i = 0; i < rows; i++) {
                    let dot = 0;
                    for (let j = 0; j < cols; j++) dot += data[i][j] * eigenvector[j];
                    for (let j = 0; j < cols; j++) nextV[j] += data[i][j] * dot;
                }
                const norm = Math.sqrt(nextV.reduce((sum, v) => sum + v*v, 0));
                eigenvector = nextV.map(v => v / norm);
            }
            return eigenvector;
        };

        const pc1 = getPC(normalized);
        
        // Project out PC1 to find PC2
        const projectedOut = normalized.map(row => {
            let dot = 0;
            for (let j = 0; j < cols; j++) dot += row[j] * pc1[j];
            return row.map((val, j) => val - dot * pc1[j]);
        });
        const pc2 = getPC(projectedOut);

        // Map back to 2D
        return normalized.map(row => {
            let c1 = 0, c2 = 0;
            for (let j = 0; j < cols; j++) {
                c1 += row[j] * pc1[j];
                c2 += row[j] * pc2[j];
            }
            return [c1, c2];
        });
    }
    if (toggleNetworkLabels) {
        toggleNetworkLabels.onchange = (e) => {
            networkSvg.selectAll('text').style('display', e.target.checked ? 'block' : 'none');
        };
    }

    function initNetwork() {
        const pairing = networkGroupSelect.value;
        let sourceAttr, targetAttr;
        if (pairing.includes('_')) {
            const parts = pairing.split('_');
            sourceAttr = parts[0];
            targetAttr = parts[1];
        } else {
            sourceAttr = 'scaffold';
            targetAttr = pairing;
        }

        const minWeight = parseInt(minEdgeWeightInput.value);
        
        const dbSelect = networkDatabaseFilter ? networkDatabaseFilter.value : 'all';
        const filteredData = dbSelect === 'all' ? allCompounds : allCompounds.filter(c => c.database === dbSelect);

        // Update Legend
        if (targetNodeLegend) {
            let legendLabel = targetAttr.charAt(0).toUpperCase() + targetAttr.slice(1);
            if (targetAttr === 'bioactivity') legendLabel = 'Disease/Activity';
            if (targetAttr === 'class') legendLabel = 'Species';
            
            let legendColor = '#38bdf8';
            if (targetAttr === 'lipinski_pass') legendColor = '#22c55e';
            targetNodeLegend.innerHTML = `<div style="width: 12px; height: 12px; border-radius: 50%; background: ${legendColor};"></div> ${legendLabel}`;
        }

        // Prepare Data
        const nodes = [];
        const links = [];
        const scaffoldNodes = new Set();
        const targetNodes = new Set();
        const connections = {}; // "scaffold|target" -> weight

        filteredData.forEach(c => {
            // Get source values
            let sources = [];
            if (sourceAttr === 'scaffold') {
                if (!c.scaffold_id || c.scaffold_id === 'acyclic') return;
                sources = [{ id: `scaffold_${c.scaffold_id}`, name: `Framework #${sortedScaffolds.indexOf(c.scaffold_smiles) + 1}`, type: 'scaffold', smiles: c.scaffold_smiles, scaffoldId: c.scaffold_id }];
            } else if (sourceAttr === 'class') {
                sources = [{ id: `class_${c.class}`, name: c.class, type: 'source' }];
            } else if (sourceAttr === 'database') {
                sources = [{ id: `db_${c.database}`, name: c.database, type: 'source' }];
            }

            // Get target values
            let targets = [];
            if (targetAttr === 'bioactivity') targets = (c.bioactivities || []).map(t => ({ id: `target_${t}`, name: t, type: 'target' }));
            else if (targetAttr === 'class') targets = [{ id: `target_${c.class}`, name: c.class, type: 'target' }];
            else if (targetAttr === 'database') targets = [{ id: `target_${c.database}`, name: c.database, type: 'target' }];
            else if (targetAttr === 'lipinski_pass') {
                const val = c.lipinski_pass ? 'Lipinski Pass' : 'Lipinski Fail';
                targets = [{ id: `target_${val}`, name: val, type: 'target' }];
            }

            sources.forEach(s => {
                targets.forEach(t => {
                    if (!t.name || t.name === 'Unclassified') return;
                    if (s.id === t.id) return; // Avoid self-loops

                    scaffoldNodes.add(JSON.stringify(s));
                    targetNodes.add(JSON.stringify(t));
                    
                    const key = `${s.id}|${t.id}`;
                    connections[key] = (connections[key] || 0) + 1;
                });
            });
        });

        // Convert sets back to objects
        const scaffoldArr = Array.from(scaffoldNodes).map(s => JSON.parse(s));
        const targetArr = Array.from(targetNodes).map(t => JSON.parse(t));
        
        // Filter links by weight
        Object.keys(connections).forEach(key => {
            const weight = connections[key];
            if (weight >= minWeight) {
                const [source, target] = key.split('|');
                links.push({ source, target, weight });
            }
        });

        // Filter out isolated nodes
        const activeNodeIds = new Set();
        links.forEach(l => { activeNodeIds.add(l.source); activeNodeIds.add(l.target); });
        
        const finalNodes = [...scaffoldArr, ...targetArr].filter(n => activeNodeIds.has(n.id));

        if (toggleSPD) {
            toggleSPD.onchange = () => {
                const checked = toggleSPD.checked;
                networkSvg.selectAll('circle').transition().duration(500)
                    .attr('r', d => {
                        if (!checked) return d.type === 'scaffold' ? 12 : 8;
                        const degree = links.filter(l => l.source.id === d.id || l.target.id === d.id).length;
                        return 8 + Math.sqrt(degree) * 4;
                    });
            };
        }

        if (runClusteringBtn) {
            runClusteringBtn.onclick = () => {
                const scafNodes = simulation.nodes().filter(n => n.type === 'scaffold');
                if (scafNodes.length < 5) return;

                const features = scafNodes.map(n => {
                    const comp = allCompounds.find(c => c.scaffold_smiles === n.smiles);
                    return [comp.mw, comp.logp, comp.tpsa, comp.hbd, comp.hba];
                });

                const clusters = kMeans(features, 5); // 5 clusters
                scafNodes.forEach((n, i) => { n.clusterId = clusters[i]; });

                const clusterColors = ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6'];
                networkSvg.selectAll('circle')
                    .filter(d => d.type === 'scaffold')
                    .transition().duration(500)
                    .attr('fill', d => clusterColors[d.clusterId % clusterColors.length]);
                
                // Add clustering to legend or separate info?
                if (targetNodeLegend) targetNodeLegend.innerHTML = `<em>Clustering Applied (5 groups)</em>`;
            };
        }

        renderNetwork({ nodes: finalNodes, links });
    }

    function renderNetwork(data) {
        if (!networkSvg.node()) return;
        networkSvg.selectAll('*').remove();
        
        const container = document.getElementById('networkContainer');
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const g = networkSvg.append('g');

        // Zoom logic
        const zoom = d3.zoom()
            .scaleExtent([0.1, 4])
            .on('zoom', (event) => g.attr('transform', event.transform));

        networkSvg.call(zoom);

        // Wire zoom buttons
        const zoomStep = 0.3;
        const zoomInBtn  = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        const zoomResetBtn = document.getElementById('zoomResetBtn');

        if (zoomInBtn) zoomInBtn.onclick = () =>
            networkSvg.transition().duration(250).call(zoom.scaleBy, 1 + zoomStep);
        if (zoomOutBtn) zoomOutBtn.onclick = () =>
            networkSvg.transition().duration(250).call(zoom.scaleBy, 1 - zoomStep);
        if (zoomResetBtn) zoomResetBtn.onclick = () =>
            networkSvg.transition().duration(350).call(zoom.transform, d3.zoomIdentity);

        simulation = d3.forceSimulation(data.nodes)
            .force('link', d3.forceLink(data.links).id(d => d.id).distance(100))
            .force('charge', d3.forceManyBody().strength(-300))
            .force('center', d3.forceCenter(width / 2, height / 2))
            .force('collision', d3.forceCollide().radius(50));

        const link = g.append('g')
            .attr('stroke', '#cbd5e1')
            .attr('stroke-opacity', 0.6)
            .selectAll('line')
            .data(data.links)
            .join('line')
            .attr('stroke-width', d => Math.sqrt(d.weight) + 1);

        const node = g.append('g')
            .selectAll('g')
            .data(data.nodes)
            .join('g')
            .attr('class', d => `node-group type-${d.type}`)
            .call(drag(simulation));

        node.append('circle')
            .attr('r', d => {
                if (toggleSPD && toggleSPD.checked) {
                    const degree = data.links.filter(l => l.source.id === d.id || l.target.id === d.id).length;
                    return 8 + Math.sqrt(degree) * 4;
                }
                return (d.type === 'scaffold' || d.type === 'source') ? 12 : 8;
            })
            .attr('fill', d => {
                if (d.clusterId !== undefined && d.type === 'scaffold') {
                    const clusterColors = ['#10b981', '#f59e0b', '#6366f1', '#ec4899', '#8b5cf6'];
                    return clusterColors[d.clusterId % clusterColors.length];
                }
                if (d.type === 'scaffold' || d.type === 'source') return '#ea580c';
                if (d.name === 'Lipinski Pass') return '#22c55e';
                if (d.name === 'Lipinski Fail') return '#ef4444';
                return '#38bdf8';
            })
            .attr('stroke', '#fff')
            .attr('stroke-width', 2);

        // Adaptive font scaling based on degree
        const degreeMap = {};
        data.nodes.forEach(n => degreeMap[n.id] = 0);
        data.links.forEach(l => {
            const src = l.source.id || l.source;
            const tgt = l.target.id || l.target;
            if (degreeMap[src] !== undefined) degreeMap[src]++;
            if (degreeMap[tgt] !== undefined) degreeMap[tgt]++;
        });
        const maxDeg = Math.max(...Object.values(degreeMap), 1);

        node.append('text')
            .text(d => d.name)
            .attr('x', 15)
            .attr('y', 5)
            .style('font-size', d => {
                const deg = degreeMap[d.id] || 0;
                const minFontSize = 8;
                const maxFontSize = 18;
                const size = minFontSize + (deg / maxDeg) * (maxFontSize - minFontSize);
                return `${size}px`;
            })
            .style('font-family', 'Inter, sans-serif')
            .style('fill', '#1e293b')
            .style('display', (toggleNetworkLabels && !toggleNetworkLabels.checked) ? 'none' : 'block')
            .style('font-weight', d => {
                const deg = degreeMap[d.id] || 0;
                return deg > (maxDeg * 0.5) ? '700' : '500';
            })
            .style('text-shadow', '0 0 4px rgba(255,255,255,0.8)');

        node.on('mouseover', (event, d) => {
            // Highlight connections
            link.style('stroke', l => (l.source === d || l.target === d) ? '#ea580c' : '#cbd5e1')
                .style('stroke-opacity', l => (l.source === d || l.target === d) ? 1 : 0.1)
                .attr('stroke-width', l => (l.source === d || l.target === d) ? (Math.sqrt(l.weight) + 3) : (Math.sqrt(l.weight) + 1));
            
            node.style('opacity', n => {
                if (n === d) return 1;
                const isConnected = data.links.some(l => (l.source === d && l.target === n) || (l.target === d && l.source === n));
                return isConnected ? 1 : 0.2;
            });

            if (!networkTooltip) return;
            networkTooltip.style.display = 'block';
            let html = `<strong>${d.name}</strong><br>Type: ${d.type}`;
            if (d.type === 'scaffold') {
                html += `<br><img src="assets/scaffolds/${d.scaffoldId}.svg" style="width:100px; height:100px; object-fit:contain; margin-top:5px; background:white; border-radius:4px;" onerror="this.style.display='none'">`;
                html += `<br><span style="font-size:0.7rem; color:#64748b; word-break:break-all;">${d.smiles}</span>`;
            }
            networkTooltip.innerHTML = html;
        }).on('mousemove', (event) => {
            if (!networkTooltip) return;
            const containerRect = container.getBoundingClientRect();
            networkTooltip.style.left = (event.clientX - containerRect.left + 15) + 'px';
            networkTooltip.style.top = (event.clientY - containerRect.top + 15) + 'px';
        }).on('mouseout', () => {
            // Reset highlighting
            link.style('stroke', '#cbd5e1')
                .style('stroke-opacity', 0.6)
                .attr('stroke-width', l => Math.sqrt(l.weight) + 1);
            node.style('opacity', 1);

            if (networkTooltip) networkTooltip.style.display = 'none';
        }).on('click', (event, d) => {
            // Node Info Panel
            const nodeInfoPanel = document.getElementById('nodeInfoPanel');
            const nodeInfoName = document.getElementById('nodeInfoName');
            const nodeInfoContent = document.getElementById('nodeInfoContent');

            if (nodeInfoPanel && nodeInfoName && nodeInfoContent) {
                nodeInfoName.textContent = d.name;
                const degree = data.links.filter(l => l.source === d || l.target === d || l.source.id === d.id || l.target.id === d.id).length;
                let infoHtml = `<div><b>Type:</b> ${d.type === 'scaffold' ? 'Scaffold' : d.type === 'source' ? 'Source' : 'Target'}</div>`;
                infoHtml += `<div><b>Connections:</b> ${degree}</div>`;

                if (d.type === 'scaffold' && d.smiles) {
                    const comps = allCompounds.filter(c => c.scaffold_smiles === d.smiles);
                    infoHtml += `<div><b>Compounds:</b> ${comps.length}</div>`;
                    if (comps.length > 0) {
                        const avgMW = (comps.reduce((s,c) => s+c.mw, 0)/comps.length).toFixed(1);
                        const avgLogP = (comps.reduce((s,c) => s+c.logp, 0)/comps.length).toFixed(2);
                        infoHtml += `<div><b>Avg MW:</b> ${avgMW} g/mol</div>`;
                        infoHtml += `<div><b>Avg LogP:</b> ${avgLogP}</div>`;
                        const allBio = [...new Set(comps.flatMap(c => c.bioactivities || []))];
                        if (allBio.length) infoHtml += `<div style="margin-top:4px;"><b>Bioactivities:</b><br>${allBio.map(b => `<span style="display:inline-block;background:#fff7ed;border:1px solid #ea580c;color:#ea580c;border-radius:4px;padding:1px 5px;margin:1px;font-size:0.7rem;">${b}</span>`).join('')}</div>`;
                        infoHtml += `<div style="margin-top:8px;"><img src="assets/scaffolds/${d.scaffoldId}.svg" style="width:100%;height:80px;object-fit:contain;background:#f8fafc;border-radius:6px;" onerror="this.style.display='none'"></div>`;
                    }
                } else {
                    const connectedScaffolds = data.links.filter(l => l.source === d || l.target === d || l.source.id === d.id || l.target.id === d.id).length;
                    infoHtml += `<div><b>Connected Scaffolds:</b> ${connectedScaffolds}</div>`;
                }

                nodeInfoContent.innerHTML = infoHtml;
                nodeInfoPanel.style.display = 'block';
            }

            if (d.type === 'scaffold') {
                // Also allow click-to-filter (Ctrl+click)
                if (event.ctrlKey || event.metaKey) {
                    networkModal.style.display = 'none';
                    scaffoldFilter.value = d.smiles;
                    activeScaffoldContainer.style.display = 'block';
                    const rank = sortedScaffolds.indexOf(d.smiles) + 1;
                    activeScaffoldName.textContent = `Framework #${rank}`;
                    document.querySelectorAll('.scaffold-item').forEach(i => {
                        if(i.getAttribute('data-smiles') === d.smiles) i.classList.add('active');
                        else i.classList.remove('active');
                    });
                    filterData();
                    resultsCounter.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });

        // --- Node Info Panel close ---
        const closeNodeInfo = document.getElementById('closeNodeInfo');
        if (closeNodeInfo) closeNodeInfo.onclick = () => { document.getElementById('nodeInfoPanel').style.display = 'none'; };

        simulation.on('tick', () => {
            link
                .attr('x1', d => d.source.x)
                .attr('y1', d => d.source.y)
                .attr('x2', d => d.target.x)
                .attr('y2', d => d.target.y);

            node
                .attr('transform', d => `translate(${d.x},${d.y})`);
        });

        // --- Color by Property ---
        const colorByProperty = document.getElementById('colorByProperty');
        const colorByLegend = document.getElementById('colorByLegend');
        const cbLegendMin = document.getElementById('cbLegendMin');
        const cbLegendMax = document.getElementById('cbLegendMax');

        if (colorByProperty) {
            colorByProperty.onchange = () => {
                const prop = colorByProperty.value;
                if (prop === 'none') {
                    colorByLegend.style.display = 'none';
                    networkSvg.selectAll('circle')
                        .transition().duration(500)
                        .attr('fill', d => {
                            if (d.type === 'scaffold' || d.type === 'source') return '#ea580c';
                            if (d.name === 'Lipinski Pass') return '#22c55e';
                            if (d.name === 'Lipinski Fail') return '#ef4444';
                            return '#38bdf8';
                        });
                    return;
                }

                const scaffoldNodes = data.nodes.filter(n => n.type === 'scaffold' && n.smiles);
                const values = scaffoldNodes.map(n => {
                    const comp = allCompounds.find(c => c.scaffold_smiles === n.smiles);
                    return comp ? comp[prop] : null;
                }).filter(v => v !== null);

                if (!values.length) return;
                const minVal = Math.min(...values);
                const maxVal = Math.max(...values);

                const propLabels = { mw: 'g/mol', logp: '', tpsa: 'Å²', hba: '', hbd: '' };
                cbLegendMin.textContent = `${minVal.toFixed(1)} ${propLabels[prop] || ''}`;
                cbLegendMax.textContent = `${maxVal.toFixed(1)} ${propLabels[prop] || ''}`;
                colorByLegend.style.display = 'block';

                // Color scale: blue → amber → red
                const colorScale = t => {
                    if (t < 0.5) {
                        const r = Math.round(56 + (245-56)*t*2);
                        const g = Math.round(189 + (158-189)*t*2);
                        const b = Math.round(248 + (11-248)*t*2);
                        return `rgb(${r},${g},${b})`;
                    } else {
                        const t2 = (t-0.5)*2;
                        const r = Math.round(245 + (239-245)*t2);
                        const g = Math.round(158 + (68-158)*t2);
                        const b = Math.round(11 + (68-11)*t2);
                        return `rgb(${r},${g},${b})`;
                    }
                };

                networkSvg.selectAll('circle')
                    .transition().duration(500)
                    .attr('fill', d => {
                        if (d.type !== 'scaffold' || !d.smiles) {
                            if (d.name === 'Lipinski Pass') return '#22c55e';
                            if (d.name === 'Lipinski Fail') return '#ef4444';
                            return '#38bdf8';
                        }
                        const comp = allCompounds.find(c => c.scaffold_smiles === d.smiles);
                        if (!comp) return '#ea580c';
                        const t = maxVal === minVal ? 0.5 : (comp[prop] - minVal) / (maxVal - minVal);
                        return colorScale(t);
                    });
            };
        }

        // --- Highlight Bioactivity ---
        const highlightBioactivity = document.getElementById('highlightBioactivity');
        if (highlightBioactivity) {
            // Populate options from data
            const allBios = [...new Set(allCompounds.flatMap(c => c.bioactivities || []))].sort();
            // Clear and re-populate
            while (highlightBioactivity.options.length > 1) highlightBioactivity.remove(1);
            allBios.forEach(b => {
                const opt = document.createElement('option');
                opt.value = b; opt.textContent = b;
                highlightBioactivity.appendChild(opt);
            });

            highlightBioactivity.onchange = () => {
                const bio = highlightBioactivity.value;
                if (!bio) {
                    networkSvg.selectAll('g.node-group').style('opacity', 1);
                    networkSvg.selectAll('line').style('stroke-opacity', 0.6).style('stroke', '#cbd5e1');
                    return;
                }
                // Find scaffold nodes connected to compounds with this bioactivity
                const relevantSmiles = new Set(allCompounds.filter(c => (c.bioactivities||[]).includes(bio)).map(c => c.scaffold_smiles));
                // Find target node id for this bioactivity
                const bioNodeId = `target_${bio}`;

                networkSvg.selectAll('g.node-group').style('opacity', d => {
                    if (d.id === bioNodeId) return 1;
                    if (d.type === 'scaffold' && relevantSmiles.has(d.smiles)) return 1;
                    return 0.08;
                });
                networkSvg.selectAll('line').style('stroke-opacity', l => {
                    const srcId = l.source.id || l.source;
                    const tgtId = l.target.id || l.target;
                    if (tgtId === bioNodeId || srcId === bioNodeId) return 0.9;
                    return 0.04;
                }).style('stroke', l => {
                    const tgtId = l.target.id || l.target;
                    const srcId = l.source.id || l.source;
                    return (tgtId === bioNodeId || srcId === bioNodeId) ? '#ea580c' : '#cbd5e1';
                });
            };
        }

        function drag(simulation) {
            function dragstarted(event) {
                if (!event.active) simulation.alphaTarget(0.3).restart();
                event.subject.fx = event.subject.x;
                event.subject.fy = event.subject.y;
                if (networkSvg.node()) networkSvg.style('cursor', 'grabbing');
            }
            function dragged(event) {
                event.subject.fx = event.x;
                event.subject.fy = event.y;
            }
            function dragended(event) {
                if (!event.active) simulation.alphaTarget(0);
                event.subject.fx = null;
                event.subject.fy = null;
                if (networkSvg.node()) networkSvg.style('cursor', 'grab');
            }
            return d3.drag()
                .on('start', dragstarted)
                .on('drag', dragged)
                .on('end', dragended);
        }
    }

    // =====================================================
    // NEW NETWORK ANALYTICS FUNCTIONS
    // =====================================================

    // --- Degree Centrality ---
    const runDegreeCentralityBtn = document.getElementById('runDegreeCentrality');
    const centralityPanel = document.getElementById('centralityPanel');
    const centralityContent = document.getElementById('centralityContent');
    const closeCentralityPanel = document.getElementById('closeCentralityPanel');

    if (closeCentralityPanel) closeCentralityPanel.onclick = () => centralityPanel.style.display = 'none';

    if (runDegreeCentralityBtn) {
        runDegreeCentralityBtn.onclick = () => {
            if (!simulation) return;
            const nodes = simulation.nodes();
            const graphData = simulation.force('link').links();

            // Calculate degree for each node
            const degreeMap = {};
            nodes.forEach(n => { degreeMap[n.id] = 0; });
            graphData.forEach(l => {
                const srcId = l.source.id || l.source;
                const tgtId = l.target.id || l.target;
                if (degreeMap[srcId] !== undefined) degreeMap[srcId]++;
                if (degreeMap[tgtId] !== undefined) degreeMap[tgtId]++;
            });

            const maxDeg = Math.max(...Object.values(degreeMap), 1);

            // Visual: resize + recolor nodes by degree
            networkSvg.selectAll('circle')
                .transition().duration(600)
                .attr('r', d => {
                    const deg = degreeMap[d.id] || 0;
                    return 8 + (deg / maxDeg) * 20;
                })
                .attr('fill', d => {
                    if (d.type !== 'scaffold' && d.type !== 'source') return '#38bdf8';
                    const deg = degreeMap[d.id] || 0;
                    const t = deg / maxDeg;
                    const r = Math.round(245 + (239-245)*t);
                    const g = Math.round(158 + (68-158)*t);
                    const b = Math.round(11 + (68-11)*t);
                    return `rgb(${r},${g},${b})`;
                });

            // Ranking panel
            const ranked = nodes
                .map(n => ({ name: n.name, degree: degreeMap[n.id] || 0, type: n.type }))
                .sort((a, b) => b.degree - a.degree)
                .slice(0, 15);

            let html = `<div style="font-size:0.7rem; color:#94a3b8; margin-bottom:8px;">Top nodes by connections. Node size proportional to degree.</div>`;
            ranked.forEach((n, i) => {
                const barW = Math.round((n.degree / maxDeg) * 100);
                const color = n.type === 'scaffold' || n.type === 'source' ? '#ea580c' : '#38bdf8';
                html += `<div style="margin-bottom:7px;">
                    <div style="display:flex;justify-content:space-between;margin-bottom:2px;">
                        <span style="font-weight:600;color:#1e293b;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:150px;" title="${n.name}">${i+1}. ${n.name}</span>
                        <span style="color:#64748b;margin-left:6px;">${n.degree}</span>
                    </div>
                    <div style="height:5px;background:#f1f5f9;border-radius:3px;overflow:hidden;">
                        <div style="height:100%;width:${barW}%;background:${color};border-radius:3px;transition:width 0.4s;"></div>
                    </div>
                </div>`;
            });

            centralityContent.innerHTML = html;
            centralityPanel.style.display = 'block';
        };
    }

    // --- Network Statistics ---
    const showNetworkStatsBtn = document.getElementById('showNetworkStats');
    const networkStatsPanel = document.getElementById('networkStatsPanel');
    const networkStatsContent = document.getElementById('networkStatsContent');
    const closeNetworkStats = document.getElementById('closeNetworkStats');

    if (closeNetworkStats) closeNetworkStats.onclick = () => networkStatsPanel.style.display = 'none';

    if (showNetworkStatsBtn) {
        showNetworkStatsBtn.onclick = () => {
            if (!simulation) return;
            const nodes = simulation.nodes();
            const links = simulation.force('link').links();

            const n = nodes.length;
            const e = links.length;
            const maxPossibleEdges = n * (n - 1) / 2;
            const density = maxPossibleEdges > 0 ? (e / maxPossibleEdges).toFixed(4) : '0';
            const degrees = nodes.map(nd => links.filter(l => l.source === nd || l.target === nd || l.source.id === nd.id || l.target.id === nd.id).length);
            const avgDegree = degrees.length ? (degrees.reduce((a,b) => a+b, 0) / degrees.length).toFixed(2) : '0';
            const maxDegree = Math.max(...degrees, 0);
            const scaffoldCount = nodes.filter(nd => nd.type === 'scaffold' || nd.type === 'source').length;
            const targetCount = nodes.filter(nd => nd.type === 'target').length;
            const isolatedCount = degrees.filter(d => d === 0).length;
            const avgWeight = links.length ? (links.reduce((s,l) => s + (l.weight||1), 0) / links.length).toFixed(1) : '0';

            const stats = [
                { label: '🔵 Total Nodes', value: n },
                { label: '🔗 Total Edges', value: e },
                { label: '🏗️ Scaffold Nodes', value: scaffoldCount },
                { label: '🎯 Target Nodes', value: targetCount },
                { label: '📊 Avg Degree', value: avgDegree },
                { label: '⭐ Max Degree', value: maxDegree },
                { label: '🕸️ Graph Density', value: density },
                { label: '⚖️ Avg Edge Weight', value: avgWeight },
                { label: '🔴 Isolated Nodes', value: isolatedCount },
                { label: '🧬 Compounds', value: allCompounds.length },
            ];

            networkStatsContent.innerHTML = stats.map(s => `
                <div style="background:#f8fafc;border-radius:10px;padding:12px 14px;border:1px solid #e2e8f0;">
                    <div style="font-size:0.72rem;color:#64748b;margin-bottom:3px;">${s.label}</div>
                    <div style="font-size:1.3rem;font-weight:700;color:#1e293b;">${s.value}</div>
                </div>
            `).join('');

            networkStatsPanel.style.display = 'block';
        };
    }

    // --- Export SVG ---
    const exportNetworkSVGBtn = document.getElementById('exportNetworkSVG');
    if (exportNetworkSVGBtn) {
        exportNetworkSVGBtn.onclick = () => {
            const svgEl = document.getElementById('networkSvg');
            if (!svgEl) return;

            // Clone SVG and add white background
            const clone = svgEl.cloneNode(true);
            clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bgRect.setAttribute('width', '100%');
            bgRect.setAttribute('height', '100%');
            bgRect.setAttribute('fill', 'white');
            clone.insertBefore(bgRect, clone.firstChild);

            // Add title
            const title = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            title.setAttribute('x', '16');
            title.setAttribute('y', '24');
            title.setAttribute('font-family', 'Inter, sans-serif');
            title.setAttribute('font-size', '14');
            title.setAttribute('font-weight', 'bold');
            title.setAttribute('fill', '#ea580c');
            title.textContent = "Life's Molecule Warehouse — Network Analysis";
            clone.insertBefore(title, clone.children[1]);

            const svgStr = new XMLSerializer().serializeToString(clone);
            const blob = new Blob([svgStr], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'LMW_network_analysis.svg';
            a.click();
            URL.revokeObjectURL(url);
        };
    }
    // =====================================================
    // CHEMOINFORMATICS INIT
    // =====================================================
    const smilesDrawer = new SmilesDrawer.Drawer({ width: 120, height: 120, activeColor: '#ea580c' });
    let viewer3D = null;

    function render3D(smiles) {
        const viewerSpace = document.getElementById('viewer3DSpace');
        const container = document.getElementById('container3D');
        if (!viewerSpace || !container || !smiles) return;
        
        viewerSpace.style.display = 'block';
        
        // Show loading state
        container.innerHTML = `
            <div style="height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center; color:#94a3b8; font-family:Inter;">
                <div class="spinner" style="width:30px; height:30px; border:3px solid rgba(56,189,248,0.2); border-top-color:#38bdf8; border-radius:50%; animation:spin 1s linear infinite; margin-bottom:10px;"></div>
                <div style="font-size:0.75rem;">Generating 3D Conformer...</div>
            </div>
        `;

        if (viewer3D) {
            viewer3D.clear();
        }

        // Fetch 3D coordinates from NCI Cactus
        fetch(`https://cactus.nci.nih.gov/chemical/structure/${encodeURIComponent(smiles)}/file?format=sdf&get3d=true`)
            .then(res => {
                if (!res.ok) throw new Error('API Error');
                return res.text();
            })
            .then(sdf => {
                container.innerHTML = ''; // Clear spinner
                if (!viewer3D) {
                    viewer3D = $3Dmol.createViewer(container, { backgroundColor: '#0f172a' });
                }
                viewer3D.addModel(sdf, "sdf");
                viewer3D.setStyle({}, { stick: { radius: 0.15, color: '#38bdf8' }, sphere: { scale: 0.25 } });
                viewer3D.zoomTo();
                viewer3D.render();
            })
            .catch(err => {
                console.error('3D Render Fail:', err);
                container.innerHTML = `
                    <div style="color: #fca5a5; padding: 30px; font-size: 0.75rem; text-align: center; height:100%; display:flex; flex-direction:column; align-items:center; justify-content:center;">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="margin-bottom:12px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
                        3D generation failed.<br>Scaffold might be too complex or offline.<br>
                        <div style="margin-top:15px; font-family:monospace; font-size:0.6rem; color:#64748b; background:#1e293b; padding:5px; border-radius:4px; word-break:break-all;">${smiles}</div>
                    </div>
                `;
            });
    }

    const reset3DBtn = document.getElementById('reset3D');
    if (reset3DBtn) reset3DBtn.onclick = () => { if (viewer3D) { viewer3D.zoomTo(); viewer3D.render(); } };

    // =====================================================
    // WORD CLOUD LOGIC
    // =====================================================
    const wordCloudBtn = document.getElementById('wordCloudD3');
    const wordCloudModal = document.getElementById('wordCloudModal');
    const closeWordCloudModal = document.getElementById('closeWordCloudModal');
    const wordCloudContainer = document.getElementById('wordCloudContainer');
    const tabBioactivity = document.getElementById('tabBioactivity');
    const tabScaffold = document.getElementById('tabScaffold');
    const wordCloudDescription = document.getElementById('wordCloudDescription');
    
    let currentCloudMode = 'bioactivity';

    if (wordCloudBtn) {
        wordCloudBtn.onclick = () => {
            wordCloudModal.style.display = 'block';
            generateWordCloud(currentCloudMode);
        };
    }

    if (tabBioactivity) {
        tabBioactivity.onclick = () => {
            currentCloudMode = 'bioactivity';
            updateTabs();
            generateWordCloud('bioactivity');
        };
    }

    if (tabScaffold) {
        tabScaffold.onclick = () => {
            currentCloudMode = 'scaffold';
            updateTabs();
            generateWordCloud('scaffold');
        };
    }

    function updateTabs() {
        if (currentCloudMode === 'bioactivity') {
            tabBioactivity.style.background = '#ea580c';
            tabBioactivity.style.color = 'white';
            tabBioactivity.style.borderColor = '#ea580c';
            tabScaffold.style.background = 'white';
            tabScaffold.style.color = '#64748b';
            tabScaffold.style.borderColor = '#e2e8f0';
            wordCloudDescription.textContent = 'Word size is proportional to the frequency of biological activities in the current filtered dataset.';
        } else {
            tabScaffold.style.background = '#ea580c';
            tabScaffold.style.color = 'white';
            tabScaffold.style.borderColor = '#ea580c';
            tabBioactivity.style.background = 'white';
            tabBioactivity.style.color = '#64748b';
            tabBioactivity.style.borderColor = '#e2e8f0';
            wordCloudDescription.textContent = 'Word size is proportional to the frequency of structural frameworks in the current filtered dataset. Click a framework to visualize in 3D.';
            document.getElementById('viewer3DSpace').style.display = 'none';
        }
    }

    if (closeWordCloudModal) {
        closeWordCloudModal.onclick = () => {
            wordCloudModal.style.display = 'none';
        };
    }

    function generateWordCloud(mode) {
        if (!wordCloudContainer) return;
        wordCloudContainer.innerHTML = '';
        
        const width = wordCloudContainer.clientWidth || 720;
        const height = wordCloudContainer.clientHeight || 500;

        const counts = {};
        const smilesMap = {};
        const currentData = allCompounds;

        currentData.forEach(c => {
            if (mode === 'bioactivity') {
                (c.bioactivities || []).forEach(b => {
                    counts[b] = (counts[b] || 0) + 1;
                });
            } else if (mode === 'scaffold' && c.scaffold_smiles) {
                const label = c.scaffold_id ? `Framework ${c.scaffold_id.replace('scaf_', '#')}` : 'Acyclic';
                counts[label] = (counts[label] || 0) + 1;
                smilesMap[label] = c.scaffold_smiles;
            }
        });

        const words = Object.entries(counts).map(([text, size]) => ({ text, size }));
        if (words.length === 0) {
            wordCloudContainer.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#64748b;">No data available for current selection.</div>';
            return;
        }

        const maxSize = Math.max(...words.map(d => d.size));
        const minSize = Math.min(...words.map(d => d.size));
        
        if (mode === 'bioactivity') {
            const fontScale = d3.scaleLinear().domain([minSize, maxSize]).range([15, 80]);
            const layout = d3.layout.cloud()
                .size([width, height])
                .words(words)
                .padding(5)
                .rotate(() => (~~(Math.random() * 2) * 90) * 0.2)
                .font("Inter")
                .fontSize(d => fontScale(d.size))
                .on("end", drawTextCloud);
            layout.start();
        } else {
            // PREMIUM FORCE-DIRECTED BUBBLE CLOUD
            const n = words.length;
            const logScale = d3.scaleLog().domain([minSize, maxSize]).range([50, 140]);

            const nodes = words.map(d => ({
                ...d,
                r: logScale(d.size) / 2,
                x: width / 2 + (Math.random() - 0.5) * 200,
                y: height / 2 + (Math.random() - 0.5) * 200
            }));

            const simulation = d3.forceSimulation(nodes)
                .force("center", d3.forceCenter(width / 2, height / 2))
                .force("charge", d3.forceManyBody().strength(-50))
                .force("collide", d3.forceCollide().radius(d => d.r + 25).iterations(4))
                .stop();

            // Run simulation to settle
            for (let i = 0; i < 250; i++) simulation.tick();

            drawScaffoldBubbles(nodes);
        }

        function drawTextCloud(words) {
            const svg = d3.select("#wordCloudContainer").append("svg")
                .attr("width", width).attr("height", height)
                .append("g").attr("transform", `translate(${width/2},${height/2})`);
            const colors = ["#ea580c", "#38bdf8", "#10b981", "#6366f1", "#f59e0b", "#0ea5e9", "#8b5cf6", "#ec4899"];
            svg.selectAll("text").data(words).enter().append("text")
                .style("font-size", d => d.size + "px")
                .style("font-family", "Inter").style("font-weight", "600")
                .style("fill", (d, i) => colors[i % colors.length])
                .attr("text-anchor", "middle")
                .attr("transform", d => `translate(${d.x},${d.y})rotate(${d.rotate})`)
                .text(d => d.text)
                .style("cursor", "pointer")
                .on("click", (event, d) => {
                    wordCloudModal.style.display = 'none';
                    const s = document.getElementById('searchInput'); if(s){s.value=d.text; s.dispatchEvent(new Event('input'));}
                });
        }

        function drawScaffoldBubbles(nodes) {
            const svg = d3.select("#wordCloudContainer").append("svg")
                .attr("width", width).attr("height", height)
                .style("background", "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)");

            // Filter out nodes that drifted too far
            const visibleNodes = nodes.filter(d => d.x > -100 && d.x < width+100 && d.y > -100 && d.y < height+100);

            const g = svg.selectAll("g.node").data(visibleNodes).enter().append("g")
                .attr("class", "node")
                .attr("transform", d => `translate(${d.x},${d.y})`)
                .style("cursor", "pointer")
                .on("mouseover", function() {
                    d3.select(this).raise();
                    d3.select(this).select("circle").transition().duration(200).attr("r", d => d.r * 1.3).style("fill", "#fff");
                    d3.select(this).select("foreignObject").transition().duration(200)
                        .attr("width", d => d.r * 2.6).attr("height", d => d.r * 2.6)
                        .attr("x", d => -d.r * 1.3).attr("y", d => -d.r * 1.3);
                })
                .on("mouseout", function() {
                    d3.select(this).select("circle").transition().duration(200).attr("r", d => d.r).style("fill", "#ffffffcc");
                    d3.select(this).select("foreignObject").transition().duration(200)
                        .attr("width", d => d.r * 2).attr("height", d => d.r * 2)
                        .attr("x", d => -d.r).attr("y", d => -d.r);
                })
                .on("click", (event, d) => {
                    const smiles = smilesMap[d.text];
                    if (smiles) {
                        d3.select(event.currentTarget).select("circle").style("stroke", "#38bdf8").style("stroke-width", "3px");
                        render3D(smiles);
                    }
                });

            // Add background circles
            g.append("circle")
                .attr("r", d => d.r)
                .style("fill", "#ffffffcc")
                .style("stroke", "#e2e8f0")
                .style("stroke-width", "1px")
                .style("filter", "drop-shadow(0 4px 6px rgba(0,0,0,0.05))");

            // Add molecule canvas
            g.append("foreignObject")
                .attr("width", d => d.r * 2)
                .attr("height", d => d.r * 2)
                .attr("x", d => -d.r)
                .attr("y", d => -d.r)
                .style("pointer-events", "none")
                .html(d => `<canvas id="scafCloud_${d.text.replace(/[^a-z0-9]/gi, '')}" width="${d.r * 4}" height="${d.r * 4}" style="width:100%; height:100%;"></canvas>`);

            // Draw molecules
            visibleNodes.forEach(d => {
                const canvasId = `scafCloud_${d.text.replace(/[^a-z0-9]/gi, '')}`;
                if (smilesMap[d.text]) {
                    SmilesDrawer.parse(smilesMap[d.text], tree => {
                        smilesDrawer.draw(tree, canvasId, 'light', false);
                    });
                }
            });

            // Add frequency indicator (optional, small text)
            g.append("text")
                .attr("y", d => d.r + 15)
                .attr("text-anchor", "middle")
                .style("font-size", "10px")
                .style("font-weight", "600")
                .style("fill", "#64748b")
                .text(d => d.size > 5 ? `${d.size}` : "");
        }
    }

    function kMeans(data, k, iterations = 20) {
        const n = data.length;
        const d = data[0].length;
        
        let centroids = [];
        for (let i = 0; i < k; i++) centroids.push(data[Math.floor(Math.random() * n)]);
        
        let assignments = new Array(n);
        
        for (let iter = 0; iter < iterations; iter++) {
            for (let i = 0; i < n; i++) {
                let minDist = Infinity;
                let cluster = 0;
                for (let j = 0; j < k; j++) {
                    let dist = 0;
                    for (let m = 0; m < d; m++) dist += Math.pow(data[i][m] - centroids[j][m], 2);
                    if (dist < minDist) { minDist = dist; cluster = j; }
                }
                assignments[i] = cluster;
            }
            
            let newCentroids = new Array(k).fill(null).map(() => new Array(d).fill(0));
            let counts = new Array(k).fill(0);
            for (let i = 0; i < n; i++) {
                let c = assignments[i];
                counts[c]++;
                for (let m = 0; m < d; m++) newCentroids[c][m] += data[i][m];
            }
            for (let j = 0; j < k; j++) {
                if (counts[j] > 0) centroids[j] = newCentroids[j].map(v => v / counts[j]);
            }
        }
        return assignments;
    }
});
