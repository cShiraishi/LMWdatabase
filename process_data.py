import pandas as pd
import json
import os
from rdkit import Chem
from rdkit.Chem import Draw
from rdkit.Chem import rdDepictor
from rdkit.Chem import Descriptors
from rdkit.Chem import Lipinski
from rdkit.Chem import rdMolDescriptors
import zipfile

# Configuration
INPUT_FILES = [
    {'file': 'ADB-compostos_padronizado-2.xlsx', 'default_db': 'ADB-compostos'},
    {'file': 'Blue_AmazonDB_padronizado (1).xlsx', 'default_db': 'BLUE_AMAZONDB'}
]
OUTPUT_DIR = 'assets/images'
SDF_DIR = 'assets/sdf'
DATA_FILE = 'data.json'

def parse_activities(activity_str):
    if not isinstance(activity_str, str) or activity_str.lower() in ['nan', 'n/a', 'none']:
        return []
    s = activity_str.lower()
    s = s.replace('/', ',').replace(' and ', ',').replace('.', '').replace('\n', '')
    parts = [p.strip() for p in s.split(',')]
    tags = []
    for p in parts:
        if not p: continue
        if 'antioxidant' in p: tags.append('Antioxidant')
        elif 'anti-inflam' in p or 'antiinflam' in p: tags.append('Anti-inflammatory')
        elif 'cancer' in p or 'carcinogen' in p or 'tumor' in p: tags.append('Anticancer')
        elif 'neuro' in p or 'alzheimer' in p: tags.append('Neuroprotective')
        elif 'cardio' in p or 'heart' in p: tags.append('Cardioprotective')
        elif 'diabe' in p or 'hyperglyc' in p or 'glucose' in p: tags.append('Anti-diabetic')
        elif 'obes' in p or 'metabol' in p: tags.append('Anti-obesity')
        elif 'microb' in p or 'bacteri' in p: tags.append('Antimicrobial')
        elif 'viral' in p: tags.append('Antiviral')
        elif 'hepato' in p: tags.append('Hepatoprotective')
        elif 'allerg' in p: tags.append('Anti-allergic')
        elif 'cholesterol' in p or 'lipid' in p: tags.append('Hypocholesterolemic')
        elif 'eye' in p or 'macular' in p or 'ocular' in p or 'blue light' in p: tags.append('Eye Protector')
        elif 'stimulant' in p: tags.append('Stimulant')
        elif 'vasodilator' in p: tags.append('Vasodilator')
        elif 'immunomodulatory' in p or 'immune' in p: tags.append('Immunomodulatory')
        elif 'aging' in p: tags.append('Anti-aging')
        elif 'depressant' in p: tags.append('Anti-depressant')
        elif 'antigenotox' in p: tags.append('Antigenotoxicity')
        elif 'genotox' in p: tags.append('Genotoxicity')
    return list(set(tags))

def process_data():
    # Create output directories
    for directory in [OUTPUT_DIR, SDF_DIR]:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"Created directory: {directory}")

    dfs = []
    for item in INPUT_FILES:
        try:
            df = pd.read_excel(item['file'])
            
            # Use 'default_db' for rows where 'database' column is missing or NaN
            if 'database' not in df.columns:
                df['database'] = item['default_db']
            else:
                df['database'] = df['database'].fillna(item['default_db'])
                
            dfs.append(df)
            print(f"Loaded {len(df)} compounds from {item['file']}")
        except Exception as e:
            print(f"Error loading {item['file']}: {e}")
    
    if not dfs:
        print("No data extracted.")
        return
        
    df_all = pd.concat(dfs, ignore_index=True)

    compounds_data = []

    for index, row in df_all.iterrows():
        try:
            # Extract data
            compound_id = str(index + 1)
            smiles = row.get('smiles', '')
            name = row.get('nome_molecula', f'Compound {compound_id}')
            compound_class = str(row.get('origem', 'Unclassified'))
            if compound_class == 'nan': compound_class = 'Unclassified'
            referencias = str(row.get('referencia', 'N/A'))
            activity = str(row.get('activity', 'N/A'))
            database_name = str(row.get('database', 'N/A'))

            if not isinstance(smiles, str) or not smiles or smiles == 'nan':
                print(f"Skipping row {index}: Invalid SMILES")
                continue

            # Generate Molecule from SMILES
            mol = Chem.MolFromSmiles(smiles)
            if mol:
                rdDepictor.Compute2DCoords(mol)
                
                # Calculate Properties
                mw = Descriptors.ExactMolWt(mol)
                logp = Descriptors.MolLogP(mol)
                tpsa = Descriptors.TPSA(mol)
                molecular_formula = rdMolDescriptors.CalcMolFormula(mol)
                
                # Lipinski Properties
                hbd = Lipinski.NumHDonors(mol)
                hba = Lipinski.NumHAcceptors(mol)
                ro5_violations = sum([
                    1 for val, limit in [(mw, 500), (logp, 5), (hbd, 5), (hba, 10)] if val > limit
                ])
                lipinski_pass = ro5_violations <= 1
                
                # specific image name
                image_filename = f"mol_{compound_id}.svg"
                image_path = os.path.join(OUTPUT_DIR, image_filename)
                
                # Generate SVG
                Draw.MolToFile(mol, image_path, size=(300, 300), imageType='svg')

                # Generate SDF
                sdf_filename = f"mol_{compound_id}.sdf"
                sdf_path = os.path.join(SDF_DIR, sdf_filename)
                w = Chem.SDWriter(sdf_path)
                mol.SetProp("_Name", name) # Set internal molecule name
                w.write(mol)
                w.close()
                
                # Add to data list
                compounds_data.append({
                    "id": compound_id,
                    "name": name,
                    "class": compound_class,
                    "molecular_formula": molecular_formula,
                    "referencias": referencias,
                    "smiles": smiles,
                    "image": image_filename,
                    "sdf": sdf_filename,
                    "mw": round(mw, 2),
                    "logp": round(logp, 2),
                    "tpsa": round(tpsa, 2),
                    "hbd": hbd,
                    "hba": hba,
                    "lipinski_pass": lipinski_pass,
                    "ro5_violations": ro5_violations,
                    "plant_part": 'N/A' if activity == 'nan' else activity,
                    "bioactivities": parse_activities(activity),
                    "database": database_name if database_name != 'nan' else ''
                })
            else:
                print(f"Failed to generate molecule for row {index} (SMILES: {smiles})")

        except Exception as e:
            print(f"Error processing row {index}: {e}")

    # Generate Bulk ZIP for docking
    zip_path = os.path.join('assets', 'all_structures.zip')
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(SDF_DIR):
            for file in files:
                if file.endswith('.sdf'):
                    file_path = os.path.join(root, file)
                    zipf.write(file_path, arcname=os.path.join('sdf', file))

    # Save to JS file
    js_content = f"const compoundsData = {json.dumps(compounds_data, indent=4)};"
    
    with open('data.js', 'w') as f:
        f.write(js_content)
    
    # Save to JSON as well
    with open('data.json', 'w') as f:
        json.dump(compounds_data, f, indent=4)
        
    print(f"Successfully processed {len(compounds_data)} compounds.")
    print(f"Bulk SDF dataset packed into {zip_path}")
    print(f"Data saved to data.js")

if __name__ == "__main__":
    process_data()
