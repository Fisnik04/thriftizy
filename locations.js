export const cityData = {
    ks: ["Artanë", "Besianë", "Burim", "Dardanë", "Deçan", "Dragash", "Drenas", "Ferizaj", "Fushë Kosovë", "Gjakovë", "Gjilan", "Kastriot", "Kaçanik", "Klinë", "Leposaviq", "Lipjan", "Malishevë", "Mitrovicë", "Pejë", "Prishtinë", "Prizren", "Rahovec", "Skenderaj", "Shtërpcë", "Shtime", "Therandë", "Viti", "Vushtrri", "Zubin Potok", "Zveçan"],
    al: ["Berat", "Bulqizë", "Delvinë", "Devoll", "Dibër", "Durrës", "Elbasan", "Fier", "Gramsh", "Gjirokastër", "Has", "Kavajë", "Kolonjë", "Korçë", "Krujë", "Kucovë", "Kukës", "Kurbin", "Lezhë", "Librazhd", "Lushnjë", "Malësi e Madhe", "Mallakastër", "Mat", "Mirditë", "Peqin", "Përmet", "Pogradec", "Pukë", "Sarandë", "Skrapar", "Shkodër", "Tepelenë", "Tiranë", "Tropojë", "Vlorë"],
    mk: ["Berovë", "Manastir", "Vallandovë", "Veles", "Vinicë", "Gjevgjeli", "Gostivar", "Dibrë", "Dellçevë", "Demir Hisar", "Kavadar", "Kërçovë", "Koçan", "Kratovë", "Kriva Pallankë", "Krushevë", "Kumanovë", "Brod", "Negotinë", "Ohër", "Prilep", "Probishtip", "Radovisht", "Resnjë", "Sveti Nikollë", "Shkup", "Strugë", "Strumicë", "Tetovë", "Shtip"]
};

export function setupCitySelector(countrySelectId, citySelectId) {
    const countrySelect = document.getElementById(countrySelectId);
    const citySelect = document.getElementById(citySelectId);
    
    if (!countrySelect || !citySelect) return;

    function update() {
        let country = countrySelect.value.toLowerCase();
        // Handle variations in values
        if (country.includes('kosovë') || country === 'ks') country = 'ks';
        else if (country.includes('shqipëri') || country === 'al') country = 'al';
        else if (country.includes('maqedoni') || country === 'mk') country = 'mk';

        const cities = cityData[country] || [];
        const currentVal = citySelect.value;
        
        citySelect.innerHTML = '<option value="">Zgjidh Qytetin</option>' + 
            cities.map(c => `<option value="${c}">${c}</option>`).join('');
            
        if (cities.includes(currentVal)) {
            citySelect.value = currentVal;
        }
    }

    countrySelect.addEventListener('change', update);
    update();
}
