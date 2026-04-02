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

    const mwSlider = document.getElementById('mwSlider');
    const logpSlider = document.getElementById('logpSlider');
    const tpsaSlider = document.getElementById('tpsaSlider');
    const mwMinLabel = document.getElementById('mwMinLabel');
    const mwMaxLabel = document.getElementById('mwMaxLabel');
    const logpMinLabel = document.getElementById('logpMinLabel');
    const logpMaxLabel = document.getElementById('logpMaxLabel');
    const tpsaMinLabel = document.getElementById('tpsaMinLabel');
    const tpsaMaxLabel = document.getElementById('tpsaMaxLabel');
    const resetBtn = document.getElementById('resetFilters');

    // Global slider instances
    let mwSliderInst, logpSliderInst, tpsaSliderInst;

    let allCompounds = (typeof compoundsData !== 'undefined') ? compoundsData : [];
    let currentFiltered = [];
    let currentPage = 1;
    const cardsPerPage = 50;

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
        
        const sortedScaffolds = Object.keys(scaffoldMap).sort((a, b) => scaffoldMap[b].count - scaffoldMap[a].count);
        if(scaffoldGallery) {
            sortedScaffolds.forEach(s => {
                const isAcyclic = scaffoldMap[s].id === 'acyclic';
                const imgTag = isAcyclic ? '' : `<img src="assets/scaffolds/${scaffoldMap[s].id}.svg" alt="scaffold" onerror="this.parentElement.style.display='none'">`;
                const labelText = isAcyclic ? 'Acyclic / Linear' : '';
                
                const itemHtml = `
                    <div class="scaffold-item" data-smiles="${s}" title="${s}">
                        ${imgTag}
                        <div style="font-weight: 600; font-size: 0.75rem;">${labelText}</div>
                        <div class="count">${scaffoldMap[s].count} mols</div>
                    </div>
                `;
                scaffoldGallery.insertAdjacentHTML('beforeend', itemHtml);
            });
            
            // Add click listeners to gallery items
            scaffoldGallery.querySelectorAll('.scaffold-item').forEach(item => {
                item.addEventListener('click', () => {
                    const sm = item.getAttribute('data-smiles');
                    
                    // Toggle logic
                    if (scaffoldFilter.value === sm) {
                        scaffoldFilter.value = '';
                        item.classList.remove('active');
                        activeScaffoldContainer.style.display = 'none';
                    } else {
                        scaffoldGallery.querySelectorAll('.scaffold-item').forEach(i => i.classList.remove('active'));
                        scaffoldFilter.value = sm;
                        item.classList.add('active');
                        activeScaffoldContainer.style.display = 'block';
                        activeScaffoldName.textContent = sm === 'Acyclic' ? 'Acyclic' : (sm.length > 20 ? sm.substring(0,20)+'...' : sm);
                    }
                    filterData();
                });
            });
        }
        
        if(clearScaffoldBtn) clearScaffoldBtn.addEventListener('click', () => {
            scaffoldFilter.value = '';
            scaffoldGallery.querySelectorAll('.scaffold-item').forEach(i => i.classList.remove('active'));
            activeScaffoldContainer.style.display = 'none';
            filterData();
        });

        // Range Sliders Initialization
        if (mwSlider) {
            mwSliderInst = noUiSlider.create(mwSlider, {
                start: [0, 1000],
                connect: true,
                range: { 'min': 0, 'max': 1000 },
                step: 10
            });
            mwSliderInst.on('update', (values) => {
                mwMinLabel.textContent = Math.round(values[0]);
                mwMaxLabel.textContent = Math.round(values[1]);
                filterData();
            });
        }

        if (logpSlider) {
            logpSliderInst = noUiSlider.create(logpSlider, {
                start: [-5, 10],
                connect: true,
                range: { 'min': -5, 'max': 10 },
                step: 0.1
            });
            logpSliderInst.on('update', (values) => {
                logpMinLabel.textContent = values[0];
                logpMaxLabel.textContent = values[1];
                filterData();
            });
        }

        if (tpsaSlider) {
            tpsaSliderInst = noUiSlider.create(tpsaSlider, {
                start: [0, 500],
                connect: true,
                range: { 'min': 0, 'max': 500 },
                step: 10
            });
            tpsaSliderInst.on('update', (values) => {
                tpsaMinLabel.textContent = Math.round(values[0]);
                tpsaMaxLabel.textContent = Math.round(values[1]);
                filterData();
            });
        }

        filterData(); // Initial load
    }

    function filterData() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedClass = classFilter ? classFilter.value : '';
        const selectedDatabase = databaseFilter ? databaseFilter.value : '';
        const selectedBioactivity = bioactivityFilter ? bioactivityFilter.value : '';
        const selectedScaffold = scaffoldFilter ? scaffoldFilter.value : '';

        // Sync chips UI
        document.querySelectorAll('.chip').forEach(chip => {
            if (chip.textContent === selectedDatabase) chip.classList.add('active');
            else chip.classList.remove('active');
        });

        const mw_values = mwSliderInst ? mwSliderInst.get() : [0, 1000];
        const logp_values = logpSliderInst ? logpSliderInst.get() : [-5, 10];
        const tpsa_values = tpsaSliderInst ? tpsaSliderInst.get() : [0, 500];

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

        currentPage = 1;
        renderCards(currentFiltered, true);
    }

    const inputs = [searchInput, classFilter, databaseFilter, bioactivityFilter, scaffoldFilter];
    inputs.forEach(input => {
        if(input) input.addEventListener('input', filterData);
    });

    resetBtn.addEventListener('click', () => {
        if(searchInput) searchInput.value = '';
        if(classFilter) classFilter.value = '';
        if(databaseFilter) databaseFilter.value = '';
        if(bioactivityFilter) bioactivityFilter.value = '';
        if(scaffoldFilter) scaffoldFilter.value = '';
        if(scaffoldGallery) scaffoldGallery.querySelectorAll('.scaffold-item').forEach(i => i.classList.remove('active'));
        if(activeScaffoldContainer) activeScaffoldContainer.style.display = 'none';
        
        if (mwSliderInst) mwSliderInst.set([0, 1000]);
        if (logpSliderInst) logpSliderInst.set([-5, 10]);
        if (tpsaSliderInst) tpsaSliderInst.set([0, 500]);
        
        filterData();
    });

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

        resultsCounter.textContent = `Showing ${maxShown} of ${totalFiltered} results (from ${allCompounds.length} total compounds)`;

        const startIndex = (currentPage - 1) * cardsPerPage;
        const endIndex = startIndex + cardsPerPage;
        const paginated = compounds.slice(startIndex, endIndex);

        paginated.forEach(compound => {
            const card = document.createElement('div');
            card.className = 'card';

            const displayName = compound.name.length > 25 ? compound.name.substring(0, 22) + '...' : compound.name;

            let refHtml = compound.referencias || 'N/A';
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
                    ${compound.class && compound.class !== 'Unclassified' ? `<span class="tag" style="position: absolute; top: 1rem; left: 1rem; margin: 0; background-color: rgba(56, 189, 248, 0.9); color: white; padding: 0.25rem 0.5rem; text-shadow: 0 1px 2px rgba(0,0,0,0.1); border-radius: 0.25rem; z-index: 10;">${compound.class}</span>` : ''}
                    <img src="assets/images/${compound.image}" alt="${compound.name}" loading="lazy" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIj48Y2lyY2xlIGN4PSIxMiIgY3k9IjEyIiByPSIxMCIvPjxsaW5lIHgxPSIxMiIgeTE9IjgiIHgyPSIxMiIgeTI9IjEyIi8+PGxpbmUgeDE9IjEyIiB5MT0iMTYiIHgyPSIxMi4wMSIgeTI9IjE2Ii8+PC9zdmc+'">
                </div>
                <div class="card-content">
                    <h2 class="card-title" title="${compound.name}">${displayName}</h2>
                    
                    <div class="card-property">
                        <span class="label">ID</span>
                        <span>${compound.id}</span>
                    </div>
                    
                    <div class="card-property">
                        <span class="label">Molecular Formula</span>
                        <span>${compound.molecular_formula}</span>
                    </div>

                    <details style="margin-top: 0.5rem; padding: 0.4rem; background: rgba(0,0,0,0.02); border-radius: 6px; border: 1px solid var(--card-border);">
                        <summary class="label" style="cursor: pointer; outline: none; font-size: 0.65rem; color: var(--accent-color); font-weight: 600; display: block; margin: 0;">Show SMILES ▼</summary>
                        <div style="display: flex; align-items: flex-start; gap: 0.5rem; justify-content: space-between; margin-top: 0.5rem;">
                            <span class="smiles-text" title="${compound.smiles}" style="margin: 0; word-break: break-all; text-align: left;">${compound.smiles}</span>
                            <button class="copy-btn" onclick="navigator.clipboard.writeText('${compound.smiles}').then(() => {let tmp=this.innerHTML; this.innerHTML='Copied!'; setTimeout(()=>this.innerHTML=tmp, 1500)})" style="background: none; border: 1px solid var(--card-border); border-radius: 4px; padding: 2px 6px; cursor: pointer; color: var(--accent-color); font-size: 0.7rem; transition: background 0.3s; flex-shrink: 0;">Copy</button>
                        </div>
                    </details>

                    <details style="margin-top: 0.5rem; padding: 0.4rem; background: rgba(0,0,0,0.02); border-radius: 6px; border: 1px solid var(--card-border);">
                        <summary class="label" style="cursor: pointer; outline: none; font-size: 0.65rem; color: var(--accent-color); font-weight: 600; display: block; margin: 0;">Show Reference ▼</summary>
                        <div style="font-size: 0.65rem; color: #475569; text-align: left; word-break: break-word; margin-top: 0.5rem; line-height: 1.4;">
                            ${refHtml}
                        </div>
                    </details>

                    ${compound.bioactivities && compound.bioactivities.length > 0 ? `
                    <div class="card-property" style="margin-top: 0.5rem; align-items: flex-start;">
                        <span class="label" title="Bioactivity">Bioactivity</span>
                        <div style="display: flex; flex-wrap: wrap; gap: 0.25rem; justify-content: flex-end; max-width: 70%;">
                            ${compound.bioactivities.map(b => `<span style="font-size: 0.6rem; background: rgba(234, 88, 12, 0.1); border: 1px solid rgba(234, 88, 12, 0.2); color: var(--accent-color); padding: 0.1rem 0.3rem; border-radius: 4px; display: inline-block;">${b}</span>`).join('')}
                        </div>
                    </div>
                    ` : ''}

                    ${compound.database ? `
                    <div class="card-property" style="margin-top: 0.5rem; align-items: flex-start;">
                        <span class="label">Database</span>
                        <span style="font-size: 0.7rem; color: #64748b; text-align: right; word-break: break-word; max-width: 70%; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;" title="${compound.database}">${compound.database}</span>
                    </div>
                    ` : ''}

                    <div class="card-property" style="margin-top: 0.5rem;">
                        <span class="label" title="Lipinski's Rule of 5 for Drug-likeness">Drug-Likeness</span>
                        <span style="font-size: 0.75rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 9999px; ${compound.lipinski_pass ? 'background: #dcfce7; color: #166534;' : 'background: #fee2e2; color: #991b1b;'}">
                            ${compound.lipinski_pass ? 'Ro5 Compliant' : `Violates Ro5 (${compound.ro5_violations})`}
                        </span>
                    </div>

                    <div class="card-stats" style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 0.25rem; margin: 1rem 0; text-align: center; border-top: 1px solid rgba(148, 163, 184, 0.1); padding-top: 0.5rem;">
                        <div class="stat-item" title="Molecular Weight">
                            <span class="label" style="display:block; font-size: 0.65rem;">MW</span>
                            <span class="value" style="font-weight: 600; color: #38bdf8; font-size: 0.8rem;">${compound.mw}</span>
                        </div>
                        <div class="stat-item" title="Lipophilicity">
                            <span class="label" style="display:block; font-size: 0.65rem;">Log<i>P</i></span>
                            <span class="value" style="font-weight: 600; color: #818cf8; font-size: 0.8rem;">${compound.logp}</span>
                        </div>
                        <div class="stat-item" title="Topological Polar Surface Area">
                            <span class="label" style="display:block; font-size: 0.65rem;">TPSA</span>
                            <span class="value" style="font-weight: 600; color: #38bdf8; font-size: 0.8rem;">${compound.tpsa}</span>
                        </div>
                        <div class="stat-item" title="H-Bond Donors">
                            <span class="label" style="display:block; font-size: 0.65rem;">HBD</span>
                            <span class="value" style="font-weight: 600; color: #34d399; font-size: 0.8rem;">${compound.hbd}</span>
                        </div>
                        <div class="stat-item" title="H-Bond Acceptors">
                            <span class="label" style="display:block; font-size: 0.65rem;">HBA</span>
                            <span class="value" style="font-weight: 600; color: #34d399; font-size: 0.8rem;">${compound.hba}</span>
                        </div>
                    </div>

                    <div class="card-actions" style="margin-top: 1rem; border-top: 1px solid rgba(148, 163, 184, 0.1); padding-top: 1rem;">
                        <a href="assets/sdf/${compound.sdf}" download="${compound.sdf}" class="download-btn" onclick="event.stopPropagation();">
                            Download SDF
                        </a>
                    </div>
                </div>
            `;
            cardGrid.appendChild(card);
        });

        if (endIndex >= totalFiltered) {
            loadMoreContainer.style.display = 'none';
        } else {
            loadMoreContainer.style.display = 'block';
        }
    }

    // Analytics Dashboard
    const analyticsBtn = document.getElementById('analyticsBtn');
    const analyticsModal = document.getElementById('analyticsModal');
    const closeAnalytics = document.getElementById('closeAnalytics');
    let charts = {};

    if (analyticsBtn) {
        analyticsBtn.addEventListener('click', () => {
            analyticsModal.style.display = 'block';
            generateCharts();
        });
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
});
