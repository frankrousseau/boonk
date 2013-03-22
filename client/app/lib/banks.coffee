banks =
    "Axa Banque":"axabanque"
    "Banque Populaire":"banquepopulaire"
    "Barclays":"barclays"
    "BNP Paribas":"bnpporc"
    "Boursorama":"boursorama"
    "Banque Postale":"bp"
    "Bred":"bred"
    "Caisse d'Epargne":"caissedepargne"
    "Carrefour Banque":"carrefourbanque"
    "CIC":"cic"
    "Crédit Agricole":"cragr"
    "Credit Coopératif":"creditcooperatif"
    "Crédit Mutuel":"creditmutuel"
    "Crédit Mutuel Bretagne":"cmb"
    "Crédit Mutuel Sud Ouest":"cmso"
    "Fortuneo":"fortuneo"
    "Gan Assurances":"ganassurances"
    "HSBC":"hsbc"
    "ING":"ing"
    "LCL":"lcl"
    "Société Générale":"societegenerale"
    
reversed_banks = {}

for bank, acronym of banks
    reversed_banks[acronym] = bank

module.exports.banks = banks
module.exports.reversed_banks = reversed_banks
