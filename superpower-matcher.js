const app = Vue.createApp({
    data() {
        return {
            superheros: [], // Liste des super-héros
            availablePowers: ["intelligence", "strength", "speed", "durability", "combat"], // Liste des pouvoirs disponibles
            selectedPowers: {
                intelligence: 0,
                strength: 0,
                speed: 0,
                durability: 0,
                combat: 0
            }, // Valeurs des pouvoirs sélectionnés
            matchingHeroes: [], // Liste des super-héros qui correspondent
            loading: false // Etat de chargement
        };
    },
    methods: {
        findHeroes() {
            this.loading = true;
            // Filtrer les héros selon les pouvoirs sélectionnés
            this.matchingHeroes = this.superheros.filter(hero => {
                return this.availablePowers.every(power => hero.powerstats[power] >= this.selectedPowers[power]);
            });
            this.loading = false;
        },
    },
    mounted() {
        // Requête pour récupérer les super-héros via Axios
        axios.get('https://cdn.jsdelivr.net/gh/rtomczak/superhero-api@0.3.0/api/all.json')
            .then(response => {
                this.superheros = response.data;
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données :', error);
            });
    },
});

app.mount('#app');
