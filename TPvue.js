const app = Vue.createApp({
    data() {
        return {
            searchQuery: "",
            showPowers: false,
            superheros: [],
            loading: true
        };
    },
    computed: {
        filteredSuperheros() {
            return this.superheros.filter(hero => {
                return hero.name.toLowerCase().includes(this.searchQuery.toLowerCase());
            });
        }
    },
    mounted() {
        this.fetchSuperheroes();
    },
    methods: {
        fetchSuperheroes() {
            axios.get('https://raw.githubusercontent.com/rtomczak/superhero-api/0.3.0/api/all.json')
                .then(response => {
                    this.superheros = response.data;
                    this.loading = false;
                })
                .catch(error => {
                    console.error('Erreur de chargement des super-héros:', error);
                    this.loading = false;
                });
        },
        fetchPowers() {
            if (!this.showPowers) {
                // Si la case est décochée, supprimer les pouvoirs affichés
                this.superheros.forEach(hero => (hero.powers = null));
                return;
            }

            // Récupérer les pouvoirs pour chaque super-héros
            const powerPromises = this.superheros.map(hero => {
                return axios.get(`https://raw.githubusercontent.com/rtomczak/superhero-api/0.3.0/api/powerstats/${hero.id}.json`)
                    .then(response => {
                        hero.powers = response.data;
                    })
                    .catch(error => {
                        console.error(`Erreur lors de la récupération des pouvoirs pour ${hero.name}:`, error);
                        hero.powers = null;
                    });
            });

            Promise.all(powerPromises)
                .then(() => {
                    console.log('Tous les pouvoirs ont été chargés.');
                })
                .catch(error => {
                    console.error('Erreur lors du chargement des pouvoirs:', error);
                });
        },
        resetSearch() {
            this.searchQuery = '';
        }
    }
});

app.mount('#app');
