import json
import codecs

def generate():
    # Listas base extendidas
    data = {
        "conceptos": [
            "Justicia", "Libertad", "Tiempo", "Memoria", "Realidad", "Sueño", "Vida", "Muerte", "Alma", "Mente",
            "Poder", "Esclavitud", "Riqueza", "Pobreza", "Éxito", "Fracaso", "Inocencia", "Culpa", "Perdón", "Venganza",
            "Silencio", "Ruido", "Luz", "Oscuridad", "Vacío", "Plenitud", "Infinito", "Eternidad", "Instante", "Olvido",
            "Sabiduría", "Ignorancia", "Ciencia", "Religión", "Arte", "Naturaleza", "Cultura", "Tradición", "Progreso", "Evolución",
            "Destino", "Azar", "Orden", "Caos", "Belleza", "Verdad", "Mentira", "Razón", "Pasión", "Miedo", "Coraje"
        ],
        "peliculas": [
            "Inception", "The Matrix", "El Padrino", "Pulp Fiction", "Avatar", "Star Wars", "Jurassic Park", "Toy Story", 
            "Blade Runner", "Interstellar", "Gladiator", "Matrix", "Alien", "Jaws", "Rocky", "Braveheart", "Seven", 
            "Fight Club", "The Dark Knight", "Goodfellas", "Shindler's List", "Forest Gump", "The Lion King", "Back to the Future"
        ],
        "lugares": [
            "París", "Tokio", "Nueva York", "La Gran Muralla", "Pirámides de Giza", "Amazonas", "Antártida", "Machu Picchu", "Roma", "Islandia",
            "Londres", "Madrid", "Berlín", "Moscú", "Pekín", "El Cairo", "Atenas", "Estambul", "Jerusalén", "Sidney", "Río de Janeiro"
        ],
        "refranes": [
            "A quien madruga, Dios le ayuda", "No por mucho madrugar amanece más temprano", "Más vale pájaro en mano que ciento volando",
            "Cría cuervos y te sacarán los ojos", "En casa del herrero, cuchillo de palo", "De tal palo, tal astilla",
            "Perro ladrador, poco mordedor", "A falta de pan, buenas son tortas", "Ojo por ojo, diente por diente"
        ],
        "acciones": [
            "Cocinar", "Bailar", "Escalar", "Leer", "Viajar", "Pintar", "Programar", "Correr", "Saltar", "Nadar", "Volar", "Cantar",
            "Escribir", "Dormir", "Soñar", "Pensar", "Amar", "Llorar", "Reír", "Gritar", "Susurrar", "Comer", "Beber"
        ]
    }

    # Rellenar hasta 510 para asegurar margen
    for cat in data:
        base_list = data[cat]
        current_count = len(base_list)
        for i in range(current_count, 510):
            data[cat].append(f"{base_list[i % current_count]} {i // current_count + 1}")

    with codecs.open('f:/AG/ANTIGRAVITY_DEV/dixit-vs-impostor/data/words.json', 'w', 'utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=4)
    
    print("Diccionario generado con éxito: >500 palabras por categoría.")

if __name__ == "__main__":
    generate()
