const peptidesData = [
    {
        "id": "MP-001",
        "name": "ABP-1",
        "origin": "Agaricus bisporus",
        "sequence": "AHEPVK",
        "length": 6,
        "mw": 679.76,
        "pi": 6.79,
        "hydrophobicity": -1.03,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_1.svg",
        "smiles": "CC(C)[C@H](NC(=O)[C@@H]1CCCN1C(=O)[C@H](CCC(=O)O)NC(=O)[C@H](Cc1c[nH]cn1)NC(=O)[C@H](C)N)C(=O)N[C@@H](CCCCN)C(=O)O",
        "description": "Competitive inhibition of angiotensin-converting enzyme. IC50 = 63 \u00b5M.",
        "referencias": "10.1021/jf403835c"
    },
    {
        "id": "MP-002",
        "name": "ABP-2",
        "origin": "Agaricus bisporus",
        "sequence": "RIGLF",
        "length": 5,
        "mw": 604.74,
        "pi": 9.75,
        "hydrophobicity": 1.24,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_2.svg",
        "smiles": "CC[C@H](C)[C@H](NC(=O)[C@@H](N)CCCNC(=N)N)C(=O)NCC(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](Cc1ccccc1)C(=O)O",
        "description": "Competitive inhibition of ACE. IC50 = 116 \u00b5M.",
        "referencias": "10.1021/jf403835c"
    },
    {
        "id": "MP-003",
        "name": "ABP-3",
        "origin": "Agaricus bisporus",
        "sequence": "PSSNK",
        "length": 5,
        "mw": 531.56,
        "pi": 9.18,
        "hydrophobicity": -2.12,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_3.svg",
        "smiles": "NCCCC[C@H](NC(=O)[C@H](CC(N)=O)NC(=O)[C@H](CO)NC(=O)[C@H](CO)NC(=O)[C@@H]1CCCN1)C(=O)O",
        "description": "Non-competitive inhibition of ACE. IC50 = 228 \u00b5M.",
        "referencias": "10.1021/jf403835c"
    },
    {
        "id": "MP-004",
        "name": "ABP (antioxidant fraction)",
        "origin": "Agaricus bisporus",
        "sequence": "NDHETEROGENEOUSPEPTIDEFRACTIONKDAASPGLURICH",
        "length": 43,
        "mw": 5265.49,
        "pi": 4.63,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Antioxidant"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Free radical scavenging; metal ion chelation; regulation of ROS production. DPPH IC50 \u2248 0.8 mg/mL.",
        "referencias": "10.3390/foods12152935"
    },
    {
        "id": "MP-005",
        "name": "GLP-QLVP",
        "origin": "Ganoderma lucidum",
        "sequence": "QLVP",
        "length": 4,
        "mw": 455.55,
        "pi": 5.53,
        "hydrophobicity": 0.72,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_5.svg",
        "smiles": "CC(C)C[C@H](NC(=O)[C@@H](N)CCC(N)=O)C(=O)N[C@H](C(=O)N1CCC[C@H]1C(=O)O)C(C)C",
        "description": "Hydrogen bond + salt bridge to ACE Lys472; activation of eNOS; reduction of endothelin-1 expression. ACE inhibition; vasodilation in HUVEC cells.",
        "referencias": "10.3390/foods12152935"
    },
    {
        "id": "MP-006",
        "name": "GLP (antioxidant fraction)",
        "origin": "Ganoderma lucidum",
        "sequence": "NDPEPTIDEFRACTIONKDADOMINANTAAPROHISILE",
        "length": 39,
        "mw": 4709.28,
        "pi": 4.52,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Hepatoprotective",
            "Antioxidant"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Soybean lipoxygenase inhibition; OH\u2022 and O2\u2022\u2212 scavenging; Nrf2-ARE pathway activation. Lipoxygenase IC50 = 27.1 \u00b5g/mL; OH\u2022 IC50 = 25 \u00b5g/mL.",
        "referencias": "10.3390/toxins14020084"
    },
    {
        "id": "MP-007",
        "name": "Eryngin",
        "origin": "Pleurotus eryngii",
        "sequence": "ATYTGKLCYADNNTERMINALAAFULLPROTEINKDA",
        "length": 12,
        "mw": 4290.73,
        "pi": 6.25,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Antimicrobial"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Inhibition of mycelial growth in Fusarium oxysporum and Mycosphaerella arachidicola. F. oxysporum IC50 = 1.35 \u00b5M; M. arachidicola IC50 = 3.5 \u00b5M.",
        "referencias": "10.1016/j.peptides.2004.09.013"
    },
    {
        "id": "MP-008",
        "name": "PEMP (antimicrobial fraction)",
        "origin": "Pleurotus eryngii",
        "sequence": "NDHYDROPHOBICPEPTIDEFRACTIONKDAFROMMYCELIUM",
        "length": 43,
        "mw": NaN,
        "pi": 4.96,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Antimicrobial",
            "Antioxidant"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Macrophage proliferation; increased TLR expression; TNF-\u03b1, IL-6, NO and H2O2 release. Inhibition of B. maydis, M. arachidicola, R. solani, C. albicans.",
        "referencias": "10.3390/foods12152935"
    },
    {
        "id": "MP-009",
        "name": "POP",
        "origin": "Pleurotus ostreatus",
        "sequence": "ATYTGKLCYADNAGFNLNTERMINALAAFULLPROTEINKDA",
        "length": 17,
        "mw": 4793.3,
        "pi": 6.25,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Antiproliferative",
            "Ribonuclease"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "RNase activity (651 U/mg on tRNA); dose-dependent inhibition of protein synthesis in reticulocyte lysate. Protein synthesis IC50 = 15 nM; Ye & Ng 2002.",
        "referencias": "10.3390/toxins14020084"
    },
    {
        "id": "MP-010",
        "name": "Pleurostrin",
        "origin": "Pleurotus ostreatus",
        "sequence": "AVNEFPNYLPGLACGDKYNTERMINALAAFULLPROTEINKDA",
        "length": 18,
        "mw": 4942.49,
        "pi": 4.94,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Antiproliferative",
            "Antimicrobial"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Inhibition of phytopathogenic fungi; protein synthesis inhibition; anti-leukemia activity. MBL2 leukemia IC50 = 15 \u00b5M; L1210 IC50 = 41 \u00b5M; Chu et al. 2005.",
        "referencias": "10.3390/toxins14020084"
    },
    {
        "id": "MP-011",
        "name": "Agrocybin",
        "origin": "Cyclocybe aegerita",
        "sequence": "APFGKLNYDAAACKNFPNYNTERMINALAAFULLPROTEINKDA",
        "length": 19,
        "mw": 5075.64,
        "pi": 8.18,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Anti-Hiv",
            "Antimicrobial"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Inhibition of phytopathogenic fungal growth; inhibition of HIV-1 reverse transcriptase. F. oxysporum IC50 = 125 \u00b5M; HIV-RT IC50 = 60 \u00b5M; stable up to 80 \u00b0C; Ngai et al. 2005.",
        "referencias": "10.1016/j.peptides.2004.10.014"
    },
    {
        "id": "MP-012",
        "name": "Ageritin",
        "origin": "Cyclocybe aegerita",
        "sequence": "ATYTGKLCFKDDNFSTYYNANTYDTSSGYEQICASDGTCNPGYYGKTCYGNGPWDEDFMQCHNHCKSTKGYKSGYCAKGGFVCKCYAAVIACDNACATALYTICTRIADHEK",
        "length": 76,
        "mw": 12319.55,
        "pi": 6.29,
        "hydrophobicity": -0.53,
        "bioactivities": [
            "Antiviral",
            "Antimicrobial",
            "Anticancer"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_12.svg",
        "smiles": "CC[C@H](C)[C@H](NC(=O)[C@H](CCCNC(=N)N)NC(=O)[C@@H](NC(=O)[C@H](CS)NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](C)NC(=O)[C@@H](NC(=O)[C@H](C)NC(=O)[C@H](CS)NC(=O)[C@H](C)NC(=O)[C@H](CC(N)=O)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CS)NC(=O)[C@H](C)NC(=O)[C@@H](NC(=O)[C@@H](NC(=O)[C@H](C)NC(=O)[C@H](C)NC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)[C@H](CS)NC(=O)[C@H](CCCCN)NC(=O)[C@H](CS)NC(=O)[C@@H](NC(=O)[C@H](Cc1ccccc1)NC(=O)CNC(=O)CNC(=O)[C@H](CCCCN)NC(=O)[C@H](C)NC(=O)[C@H](CS)NC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)CNC(=O)[C@H](CO)NC(=O)[C@H](CCCCN)NC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)CNC(=O)[C@H](CCCCN)NC(=O)[C@@H](NC(=O)[C@H](CO)NC(=O)[C@H](CCCCN)NC(=O)[C@H](CS)NC(=O)[C@H](Cc1c[nH]cn1)NC(=O)[C@H](CC(N)=O)NC(=O)[C@H](Cc1c[nH]cn1)NC(=O)[C@H](CS)NC(=O)[C@H](CCC(N)=O)NC(=O)[C@H](CCSC)NC(=O)[C@H](Cc1ccccc1)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](Cc1c[nH]c2ccccc12)NC(=O)[C@@H]1CCCN1C(=O)CNC(=O)[C@H](CC(N)=O)NC(=O)CNC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)[C@H](CS)NC(=O)[C@@H](NC(=O)[C@H](CCCCN)NC(=O)CNC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)CNC(=O)[C@@H]1CCCN1C(=O)[C@H](CC(N)=O)NC(=O)[C@H](CS)NC(=O)[C@@H](NC(=O)CNC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CO)NC(=O)[C@H](C)NC(=O)[C@H](CS)NC(=O)[C@@H](NC(=O)[C@H](CCC(N)=O)NC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)CNC(=O)[C@H](CO)NC(=O)[C@H](CO)NC(=O)[C@@H](NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)[C@@H](NC(=O)[C@H](CC(N)=O)NC(=O)[C@H](C)NC(=O)[C@H](CC(N)=O)NC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)[C@@H](NC(=O)[C@H](CO)NC(=O)[C@H](Cc1ccccc1)NC(=O)[C@H](CC(N)=O)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CCCCN)NC(=O)[C@H](Cc1ccccc1)NC(=O)[C@H](CS)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](CCCCN)NC(=O)CNC(=O)[C@@H](NC(=O)[C@H](Cc1ccc(O)cc1)NC(=O)[C@@H](NC(=O)[C@H](C)N)[C@@H](C)O)[C@@H](C)O)[C@@H](C)O)[C@@H](C)O)[C@@H](C)O)[C@@H](C)CC)[C@@H](C)O)[C@@H](C)O)[C@@H](C)O)C(C)C)C(C)C)[C@@H](C)CC)[C@@H](C)O)[C@@H](C)O)[C@@H](C)CC)[C@@H](C)O)C(=O)N[C@@H](C)C(=O)N[C@@H](CC(=O)O)C(=O)N[C@@H](Cc1c[nH]cn1)C(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](CCCCN)C(=O)O",
        "description": "Specific ribonuclease: cleaves phosphodiester bond in the sarcin-ricin loop of 28S rRNA \u2192 protein synthesis inhibition \u2192 apoptosis. Inhibition of B. cinerea, F. oxysporum, P. piricola; >2.5 mg/100 g fresh mushroom; Landi et al. 2017.",
        "referencias": "10.3390/toxins13040263"
    },
    {
        "id": "MP-013",
        "name": "Cordymin",
        "origin": "Cordyceps militaris",
        "sequence": "ATYTGKLCYADNTERMINALAAFULLPROTEINKDA",
        "length": 11,
        "mw": 4176.63,
        "pi": 6.25,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Anti-Hiv",
            "Antimicrobial"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Inhibition of phytopathogenic fungi; inhibition of HIV-1 RT; disruption of bacterial membranes \u2192 intracellular protein leakage. Antifungal IC50 range 10\u2013750 \u00b5M; HIV-RT IC50 = 55 \u00b5M; MCF-7 breast cancer inhibition; Wong et al. 2011.",
        "referencias": "10.3390/toxins14020084"
    },
    {
        "id": "MP-014",
        "name": "Plectasin",
        "origin": "Pseudoplectania nigrella",
        "sequence": "GFGCNGPWDEDDMQCHNHCKSIKGYKGGYCAKGGFVCKCY",
        "length": 40,
        "mw": 4407.97,
        "pi": 7.77,
        "hydrophobicity": -0.7,
        "bioactivities": [
            "Antimicrobial"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_14.svg",
        "smiles": "CC[C@H](C)[C@H](NC(=O)[C@H](CO)NC(=O)[C@H](CCCCN)NC(=O)[C@H](CS)NC(=O)[C@H](Cc1c[nH]cn1)NC(=O)[C@H](CC(N)=O)NC(=O)[C@H](Cc1c[nH]cn1)NC(=O)[C@H](CS)NC(=O)[C@H](CCC(N)=O)NC(=O)[C@H](CCSC)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](CCC(=O)O)NC(=O)[C@H](CC(=O)O)NC(=O)[C@H](Cc1c[nH]c2ccccc12)NC(=O)[C@@H]1CCCN1C(=O)CNC(=O)[C@H](CC(N)=O)NC(=O)[C@H](CS)NC(=O)CNC(=O)[C@H](Cc1ccccc1)NC(=O)CN)C(=O)N[C@@H](CCCCN)C(=O)NCC(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](CCCCN)C(=O)NCC(=O)NCC(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](CS)C(=O)N[C@@H](C)C(=O)N[C@@H](CCCCN)C(=O)NCC(=O)NCC(=O)N[C@@H](Cc1ccccc1)C(=O)N[C@H](C(=O)N[C@@H](CS)C(=O)N[C@@H](CCCCN)C(=O)N[C@@H](CS)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)O)C(C)C",
        "description": "Bactericidal; binds Lipid II (cell wall precursor) of Gram+ bacteria; \u03b1/\u03b2 structure with 3 disulfide bonds; no mammalian cytotoxicity. Active against S. pneumoniae, MRSA and other Gram+; no hemolysis; active in mouse peritoneal infection model; Mygind et al. 2005 Nature 437.",
        "referencias": "10.3390/toxins14020084"
    },
    {
        "id": "MP-015",
        "name": "GF-ACE peptide",
        "origin": "Grifola frondosa",
        "sequence": "LKALNVL",
        "length": 7,
        "mw": 769.97,
        "pi": 8.75,
        "hydrophobicity": 1.43,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_15.svg",
        "smiles": "CC(C)C[C@H](NC(=O)[C@@H](NC(=O)[C@H](CC(N)=O)NC(=O)[C@H](CC(C)C)NC(=O)[C@H](C)NC(=O)[C@H](CCCCN)NC(=O)[C@@H](N)CC(C)C)C(C)C)C(=O)O",
        "description": "Competitive inhibition of ACE; C-terminal Leu favours binding to ACE active site. IC50 = 0.13 mg; competitive inhibition; Choi et al. 2001 Food Res Int 34:177.",
        "referencias": "10.3390/toxins14020084"
    },
    {
        "id": "MP-016",
        "name": "HM-ACE peptide",
        "origin": "Hypsizygus marmoreus",
        "sequence": "WQHH",
        "length": 4,
        "mw": 606.63,
        "pi": 6.92,
        "hydrophobicity": -2.7,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_16.svg",
        "smiles": "NC(=O)CC[C@H](NC(=O)[C@@H](N)Cc1c[nH]c2ccccc12)C(=O)N[C@@H](Cc1c[nH]cn1)C(=O)N[C@@H](Cc1c[nH]cn1)C(=O)O",
        "description": "ACE inhibition; His imidazole groups contribute to radical scavenging; DPPH and ABTS scavenging. IC50 = 0.19 mg/mL; antihypertensive in SHR rats; note: published MW 567.30 Da vs theoretical 949.09 Da; Kang et al. 2013.",
        "referencias": "10.1155/2013/283964"
    },
    {
        "id": "MP-017",
        "name": "PSULP (ubiquitin-like)",
        "origin": "Lentinus sajor-caju",
        "sequence": "MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQRLIFAGKQLEDGRNTERMINALAAIDENTICALTOUBIQUITINFULLPROTEINKDA",
        "length": 54,
        "mw": 6065.25,
        "pi": 4.88,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Ribonuclease",
            "Translation Inhibition"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Inhibition of protein synthesis in rabbit reticulocyte lysate cell-free system; RNase activity on tRNA. Translation IC50 = 30 nM; RNase activity 450 IU/mg on yeast tRNA; Ng et al. 2002.",
        "referencias": "10.3390/toxins14020084"
    },
    {
        "id": "MP-018",
        "name": "MG-ACE tripeptide",
        "origin": "Macrocybe gigantea",
        "sequence": "GQP",
        "length": 3,
        "mw": 300.31,
        "pi": 5.53,
        "hydrophobicity": -1.83,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_18.svg",
        "smiles": "NCC(=O)N[C@@H](CCC(N)=O)C(=O)N1CCC[C@H]1C(=O)O",
        "description": "Competitive inhibition of ACE; C-terminal Pro characteristic of potent ACE inhibitors. IC50 = 0.31 mg; antihypertensive in SHR rats; Lee et al. 2004.",
        "referencias": "10.3390/toxins14020084"
    },
    {
        "id": "MP-019",
        "name": "SU2 peptide",
        "origin": "Russula paludosa",
        "sequence": "NDKDAPEPTIDENTERMINALSEQUENCEDNOINDIVIDUALSEQUENCEPUBLISHED",
        "length": 59,
        "mw": NaN,
        "pi": 4.05,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Anti-Hiv"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Inhibition of HIV-1 reverse transcriptase. HIV-RT IC50 = 11 mM; no antifungal, protease or hemagglutinin activity; Wang et al. 2007.",
        "referencias": "10.3390/toxins14020084"
    },
    {
        "id": "MP-020",
        "name": "TFP (macrophage-activating protein)",
        "origin": "Tremella fuciformis",
        "sequence": "NDHOMODIMERICPROTEINAAENCODEDBYNTORFNOINDIVIDUALBIOACTIVEPEPTIDESEQUENCEPUBLISHED",
        "length": 112,
        "mw": NaN,
        "pi": 4.05,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Immunomodulatory"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Macrophage activation via TLR4-NF-\u03baB pathway; stimulation of TNF-\u03b1, IL-1\u03b2, IL-12; CD86/MHC II expression. M1-polarisation of murine peritoneal macrophages; Hung et al. 2014 PMID 24400969.",
        "referencias": "10.1021/jf403835c"
    },
    {
        "id": "MP-021",
        "name": "PG neuroprotective hydrolysate",
        "origin": "Pleurotus geesteranus",
        "sequence": "NDPEPTIDEFRACTIONKDAFROMSIMULATEDGIDIGESTIONDOMINANTAALEUALAPHE",
        "length": 63,
        "mw": 7457.09,
        "pi": 4.07,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Neuroprotective",
            "Antioxidant"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "ROS scavenging; activation of CAT, GPx, SOD in H2O2-injured PC12 cells. 26.7% increase in PC12 cell viability; Wu et al. 2021 J Food Biochem 46.",
        "referencias": "10.1111/jfbc.13879"
    },
    {
        "id": "MP-022",
        "name": "ABp (anti-aging peptide)",
        "origin": "Agaricus blazei",
        "sequence": "NDPEPTIDEFRACTIONKDAENRICHEDINHYDROPHOBICANDNEGATIVELYCHARGEDAA",
        "length": 63,
        "mw": NaN,
        "pi": 4.51,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Anti-Aging",
            "Antioxidant"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Reduction of MDA and ROS; increase of CAT and T-AOC; Keap1 downregulation \u2192 Nrf2 upregulation. D-galactose aging model in NIH/3T3 cells and mice; Zhou et al. 2023.",
        "referencias": "10.3390/foods12152935"
    },
    {
        "id": "MP-023",
        "name": "CULP (ubiquitin-like)",
        "origin": "Handkea utriformis",
        "sequence": "MQIFVKTLTGKTITLEVEPSDTIENVKAKIQDKEGIPPDQQRLIFAGKQLEDGRNTERMINALAAIDENTITYWITHUBIQUITINFULLPROTEINKDA",
        "length": 54,
        "mw": 6065.25,
        "pi": 5.07,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "N-Glycosylase",
            "Translation Inhibitor",
            "Anticancer"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "N-glycosylase activity; inhibition of protein synthesis in reticulocyte lysate; antiproliferative vs breast carcinoma; antimitogenic vs splenocytes. Antiproliferative IC50 = 0.1 \u00b5M; antimitogenic IC50 = 0.1 \u00b5M; RNase 1 IU/mg on tRNA; Lam et al. 2001.",
        "referencias": "10.3390/toxins14020084"
    },
    {
        "id": "MP-024",
        "name": "SC antioxidant fraction",
        "origin": "Schizophyllum commune",
        "sequence": "NDAROMATICPEPTIDEFRACTIONKDADOMINANTAAPHETRPTYR",
        "length": 47,
        "mw": 5648.35,
        "pi": 5.0,
        "hydrophobicity": 0.0,
        "bioactivities": [
            "Antioxidant"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "peptide_placeholder.svg",
        "smiles": "",
        "description": "Free radical scavenging via benzene rings and indole groups of aromatic AA; internal resonance stabilization. High DPPH and ABTS scavenging capacity.",
        "referencias": "10.3390/foods12152935"
    },
    {
        "id": "MP-025",
        "name": "PC-ACE peptide (1 & 2)",
        "origin": "Pleurotus cornucopiae",
        "sequence": "IVGAQQPEPTIDERLSRQTIEVTSEYLFRHPEPTIDE",
        "length": 37,
        "mw": 4295.67,
        "pi": 4.49,
        "hydrophobicity": -0.79,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_25.svg",
        "smiles": "CC[C@H](C)[C@H](N)C(=O)N[C@H](C(=O)NCC(=O)N[C@@H](C)C(=O)N[C@@H](CCC(N)=O)C(=O)N[C@@H](CCC(N)=O)C(=O)N1CCC[C@H]1C(=O)N[C@@H](CCC(=O)O)C(=O)N1CCC[C@H]1C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@@H](CC(=O)O)C(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](CCCNC(=N)N)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](CO)C(=O)N[C@@H](CCCNC(=N)N)C(=O)N[C@@H](CCC(N)=O)C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@@H](CCC(=O)O)C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@@H](CO)C(=O)N[C@@H](CCC(=O)O)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)N[C@@H](CC(C)C)C(=O)N[C@@H](Cc1ccccc1)C(=O)N[C@@H](CCCNC(=N)N)C(=O)N[C@@H](Cc1c[nH]cn1)C(=O)N1CCC[C@H]1C(=O)N[C@@H](CCC(=O)O)C(=O)N1CCC[C@H]1C(=O)N[C@H](C(=O)N[C@H](C(=O)N[C@@H](CC(=O)O)C(=O)N[C@@H](CCC(=O)O)C(=O)O)[C@@H](C)CC)[C@@H](C)O)[C@@H](C)O)C(C)C)[C@@H](C)CC)[C@@H](C)O)[C@@H](C)CC)[C@@H](C)O)C(C)C",
        "description": "Competitive inhibition of ACE; C-terminal Gln / His contribute to binding. Peptide 1 IC50 = 0.45 mg; Peptide 2 IC50 = 1.10 mg; antihypertensive in SHR rats (600 mg/kg); Jang et al. 2011.",
        "referencias": "10.1016/j.foodchem.2011.01.010"
    },
    {
        "id": "MP-026",
        "name": "PA-ACE pentapeptide",
        "origin": "Pholiota adiposa",
        "sequence": "MTPRY",
        "length": 5,
        "mw": 666.79,
        "pi": 8.5,
        "hydrophobicity": -1.24,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_26.svg",
        "smiles": "CSCC[C@H](N)C(=O)N[C@H](C(=O)N1CCC[C@H]1C(=O)N[C@@H](CCCNC(=N)N)C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)O)[C@@H](C)O",
        "description": "Competitive inhibition of ACE; C-terminal Tyr favours interaction with ACE S2 site. IC50 = 0.04 mg; antihypertensive in SHR rats (1 mg/kg); most potent ACE inhibitory mushroom peptide in Landi et al. 2022 review.",
        "referencias": "10.3390/toxins14020084"
    },
    {
        "id": "MP-027",
        "name": "GL-mycelium ACE peptide AAPF",
        "origin": "Ganoderma lucidum",
        "sequence": "AAPF",
        "length": 4,
        "mw": 404.46,
        "pi": 5.57,
        "hydrophobicity": 1.2,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_27.svg",
        "smiles": "C[C@H](N)C(=O)N[C@@H](C)C(=O)N1CCC[C@H]1C(=O)N[C@@H](Cc1ccccc1)C(=O)O",
        "description": "ACE inhibition; C-terminal Phe essential for activity. IC50 = 0.013 mg/mL; 1 of 3 peptides from mycelium; Wu et al. 2019.",
        "referencias": "10.1021/acs.jafc.9b02276"
    },
    {
        "id": "MP-028",
        "name": "GL-mycelium ACE peptide NWFP",
        "origin": "Ganoderma lucidum",
        "sequence": "NWFP",
        "length": 4,
        "mw": 562.62,
        "pi": 5.53,
        "hydrophobicity": -0.8,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_28.svg",
        "smiles": "NC(=O)C[C@H](N)C(=O)N[C@@H](Cc1c[nH]c2ccccc12)C(=O)N[C@@H](Cc1ccccc1)C(=O)N1CCC[C@H]1C(=O)O",
        "description": "ACE inhibition; Trp hydrophobic interaction with ACE active site. IC50 = 0.021 mg/mL; antihypertensive in SHR rats; Wu et al. 2019.",
        "referencias": "10.1021/acs.jafc.9b02276"
    },
    {
        "id": "MP-029",
        "name": "GL-mycelium ACE peptide RWLP",
        "origin": "Ganoderma lucidum",
        "sequence": "RWLP",
        "length": 4,
        "mw": 570.68,
        "pi": 9.75,
        "hydrophobicity": -0.8,
        "bioactivities": [
            "Antihypertensive"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_29.svg",
        "smiles": "CC(C)C[C@H](NC(=O)[C@H](Cc1c[nH]c2ccccc12)NC(=O)[C@@H](N)CCCNC(=N)N)C(=O)N1CCC[C@H]1C(=O)O",
        "description": "ACE inhibition; N-terminal Arg + C-terminal Pro confer potency. IC50 = 0.018 mg/mL; antihypertensive in SHR rats; Wu et al. 2019.",
        "referencias": "10.1021/acs.jafc.9b02276"
    },
    {
        "id": "MP-030",
        "name": "GLP4 pentapeptide",
        "origin": "Ganoderma lingzhi",
        "sequence": "AIPVY",
        "length": 5,
        "mw": 561.67,
        "pi": 5.57,
        "hydrophobicity": 1.52,
        "bioactivities": [
            "Antioxidant"
        ],
        "database": "MPDb (Mushroom Peptides)",
        "image": "pep_30.svg",
        "smiles": "CC[C@H](C)[C@H](NC(=O)[C@H](C)N)C(=O)N1CCC[C@H]1C(=O)N[C@H](C(=O)N[C@@H](Cc1ccc(O)cc1)C(=O)O)C(C)C",
        "description": "Direct free radical scavenging + Nrf2/Keap1-ARE pathway activation; hydrophobic AA (Ile, Val, Tyr) essential. DPPH IC50 = 0.87 mM; ABTS IC50 = 0.54 mM; Huang et al. 2022 Food Funct.",
        "referencias": "10.1039/D2FO01572B"
    }
];