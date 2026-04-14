import os
import pandas as pd
import json
from rdkit import Chem
from rdkit.Chem import Draw
from rdkit.Chem import rdDepictor
from Bio.SeqUtils.ProtParam import ProteinAnalysis

def parse_activities(activity_str):
    if not isinstance(activity_str, str) or activity_str.lower() in ['nan', 'n/a', 'none']:
        return []
    s = activity_str.lower()
    # Normalize common separators
    s = s.replace('/', ',').replace(';', ',').replace(' and ', ',').replace('.', '').replace('\n', '')
    parts = [p.strip() for p in s.split(',')]
    
    # Custom mapping to match the site's categories
    tags = []
    for p in parts:
        if not p: continue
        if 'antioxidant' in p: tags.append('Antioxidant')
        elif 'anti-inflam' in p or 'antiinflam' in p: tags.append('Anti-inflammatory')
        elif 'cancer' in p or 'cytotoxic' in p: tags.append('Anticancer')
        elif 'neuro' in p: tags.append('Neuroprotective')
        elif 'microb' in p or 'bacteri' in p or 'fungal' in p: tags.append('Antimicrobial')
        elif 'viral' in p: tags.append('Antiviral')
        elif 'diabe' in p: tags.append('Anti-diabetic')
        elif 'hypertens' in p or 'ace' in p: tags.append('Antihypertensive')
        elif 'protease' in p: tags.append('Protease Inhibitor')
        elif 'immuno' in p: tags.append('Immunomodulatory')
        else:
            # Add original title-cased if no match
            tags.append(p.title())
    return list(set(tags))

def process_peptides():
    input_file = 'MPDb.xlsx'
    output_file = 'peptides_data.js'
    IMG_DIR = 'assets/images'
    
    if not os.path.exists(IMG_DIR):
        os.makedirs(IMG_DIR)

    print(f"Reading {input_file}...")
    try:
        df = pd.read_excel(input_file, header=2)
    except Exception as e:
        print(f"Error reading Excel: {e}")
        return

    peptides_list = []
    
    for index, row in df.iterrows():
        try:
            seq = str(row.get('Amino Acid Sequence', '')).strip()
            if not seq or seq == 'nan' or len(seq) < 2:
                continue
            
            # Basic cleanup of sequence
            seq_clean = ''.join([c for c in seq.upper() if c.isalpha()])
            
            # Generate Molecule from Sequence for Image and SMILES
            img_filename = f"pep_{index+1}.svg"
            pep_smiles = ""
            try:
                mol = Chem.MolFromSequence(seq_clean)
                if mol:
                    rdDepictor.Compute2DCoords(mol)
                    Draw.MolToFile(mol, os.path.join(IMG_DIR, img_filename), size=(400, 400), imageType='svg')
                    pep_smiles = Chem.MolToSmiles(mol)
                else:
                    img_filename = "peptide_placeholder.svg"
            except:
                img_filename = "peptide_placeholder.svg"

            # ProtParam Analysis
            analysis = ProteinAnalysis(seq_clean)
            try:
                pi = round(analysis.isoelectric_point(), 2)
            except:
                pi = 7.0
            
            try:
                mw = round(analysis.molecular_weight(), 2)
            except:
                mw = float(row.get('Calculated MW (Da)', row.get('Molecular Weight (Da)', 0)))

            # Hydrophobicity (Gravy score)
            try:
                hydro = round(analysis.gravy(), 2)
            except:
                hydro = 0.0

            name = str(row.get('Peptide Name', f'Peptide {index+1}'))
            origin = str(row.get('Mushroom Species', 'Unknown Mushroom'))
            bio_act = str(row.get('Biological Activity', 'N/A'))
            mechanism = str(row.get('Mechanism of Action', ''))
            notes = str(row.get('IC50 / Activity Notes', ''))
            
            description = f"{mechanism}. {notes}".strip('. ') + "."
            if description == ".": description = "Bioactive peptide from mushroom."

            pubmed = str(row.get('PubMed Reference', ''))
            doi = str(row.get('DOI', ''))
            referencias = doi if doi and doi != 'nan' else pubmed

            try:
                length = int(row.get('No. Residues', len(seq_clean)))
            except:
                length = len(seq_clean)

            peptides_list.append({
                "id": str(row.get('ID', f'P{index+1}')),
                "name": name,
                "origin": origin,
                "sequence": seq_clean,
                "length": length,
                "mw": mw,
                "pi": pi,
                "hydrophobicity": hydro,
                "bioactivities": parse_activities(bio_act),
                "database": "MPDb (Mushroom Peptides)",
                "image": img_filename,
                "smiles": pep_smiles,
                "description": description,
                "referencias": referencias
            })
            
        except Exception as e:
            print(f"Error processing row {index}: {e}")

    # Write to JS
    js_content = f"const peptidesData = {json.dumps(peptides_list, indent=4)};"
    with open(output_file, 'w') as f:
        f.write(js_content)
        
    print(f"Successfully processed {len(peptides_list)} peptides. Saved to {output_file}")

if __name__ == "__main__":
    process_peptides()
