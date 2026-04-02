import pandas as pd
from rdkit import Chem
from rdkit.Chem.Scaffolds import MurckoScaffold

df = pd.concat([pd.read_excel('ADB-compostos_padronizado-2.xlsx'), pd.read_excel('Blue_AmazonDB_padronizado (1).xlsx')])
scaffolds = []
for smiles in df['smiles'].dropna():
    try:
        mol = Chem.MolFromSmiles(str(smiles))
        if mol:
            scaffold = MurckoScaffold.GetScaffoldForMol(mol)
            scaffold_smiles = Chem.MolToSmiles(scaffold)
            scaffolds.append(scaffold_smiles)
    except:
        pass

s = pd.Series(scaffolds)
counts = s.value_counts()
print(f"Total valid molecules: {len(scaffolds)}")
print(f"Unique scaffolds: {len(counts)}")
print("Top 10 scaffolds:")
print(counts.head(10))
