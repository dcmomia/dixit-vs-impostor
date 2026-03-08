import json
import codecs
import random

def generate_better_words():
    # Diccionarios de semillas temáticas para expansión sin números
    dictionary = {
        "conceptos": [
            "Amor", "Miedo", "Hambre", "Sueño", "Frío", "Calor", "Dinero", "Trabajo", "Fiesta", "Vacaciones",
            "Música", "Deporte", "Salud", "Tiempo", "Internet", "Escuela", "Amistad", "Suerte", "Duda", "Envidia",
            "Orgullo", "Pueblo", "Ciudad", "Silencio", "Ruido", "Perfume", "Color", "Sabor", "Viento", "Sol",
            "Lluvia", "Nieve", "Fuego", "Tierra", "Energía", "Magia", "Ciencia", "Espacio", "Pasado", "Futuro",
            "Infancia", "Vejez", "Aburrimiento", "Sorpresa", "Peligro", "Seguridad", "Justicia", "Ley", "Paz", "Guerra"
        ] * 12, # Usaremos variaciones o sinónimos para no meter números
        
        "peliculas": [
            "Titanic", "El Rey León", "Star Wars", "Harry Potter", "Spider-Man", "Batman", "Frozen", "Shrek",
            "Toy Story", "Jurassic Park", "Matrix", "Avengers", "Piratas del Caribe", "Buscando a Nemo",
            "El Señor de los Anillos", "Juego de Tronos", "Los Simpson", "Stranger Things", "La Casa de Papel",
            "Coco", "Up", "Iron Man", "Wonder Woman", "Superman", "Indiana Jones", "E.T.", "Regreso al Futuro",
            "Cazafantasmas", "Misión Imposible", "Rápido y Furioso", "Harry Potter", "Crepúsculo", "Los Juegos del Hambre",
            "La Bella y la Bestia", "Cenicienta", "Aladdin", "Mulan", "El Libro de la Selva", "Tarzán", "Pinocchio"
        ] * 15,

        "lugares": [
            "Bosque", "Playa", "Montaña", "Cielo", "Desierto", "Océano", "Selva", "Río", "Lago", "Cueva",
            "Volcán", "Isla", "Campo", "Parque", "Zoo", "Cine", "Restaurante", "Hotel", "Hospital", "Escuela",
            "Biblioteca", "Aeropuerto", "Estación", "Puente", "Castillo", "Museo", "Iglesia", "Luna", "Marte",
            "Nube", "Fondo del mar", "Granja", "Fábrica", "Oficina", "Gimnasio", "Tienda", "Mercado", "Calle", "Plaza",
            "Pueblo", "Ciudad", "País", "Continente", "Planeta", "Universo", "Jardín", "Patio", "Balcón", "Terraza"
        ] * 12,

        "refranes": [
            "Al que madruga Dios le ayuda", "Más vale tarde que nunca", "Perro que ladra no muerde",
            "A caballo regalado no se le mira el colmillo", "Ojo por ojo diente por diente",
            "Donde hubo fuego cenizas quedan", "Más vale pájaro en mano que cien volando",
            "Camarón que se duerme se lo lleva la corriente", "De tal palo tal astilla",
            "No hay mal que por bien no venga", "A buen entendedor pocas palabras bastan",
            "En boca cerrada no entran moscas", "La curiosidad mató al gato", "El que la hace la paga"
        ] * 38,

        "acciones": [
            "Bailar", "Cantar", "Correr", "Comer", "Dormir", "Beber", "Estudiar", "Jugar", "Reír", "Llorar",
            "Gritar", "Susurrar", "Caminar", "Saltar", "Nadar", "Volar", "Pintar", "Dibujar", "Cocinar",
            "Limpiar", "Viajar", "Comprar", "Vender", "Soñar", "Pensar", "Escribir", "Leer", "Escuchar", "Mirar",
            "Tocar", "Sentir", "Besar", "Abrazar", "Pelear", "Ayudar", "Enseñar", "Aprender", "Manejar", "Volar",
            "Pescar", "Cazar", "Coser", "Tejer", "Arreglar", "Romper", "Llamar", "Enviar", "Recibir", "Dar", "Tener"
        ] * 12
    }

    # Para evitar números y duplicados exactos en una misma categoría, 
    # generaremos combinaciones sencillas estilo Dixit (Adjetivo + Sustantivo)
    adjetivos = ["Rojo", "Azul", "Grande", "Pequeño", "Viejo", "Nuevo", "Rápido", "Lento", "Lindo", "Feo", "Caro", "Barato", "Dulce", "Amargo", "Fuerte", "Débil", "Oscuro", "Claro", "Pesado", "Ligero"]
    
    final_data = {}
    for cat, items in dictionary.items():
        unique_items = list(set(items))
        final_list = unique_items.copy()
        
        while len(final_list) < 510:
            word = random.choice(unique_items)
            adj = random.choice(adjetivos)
            combined = f"{word} {adj}"
            if combined not in final_list:
                final_list.append(combined)
        
        final_data[cat] = final_list[:510]

    target_path = "f:/AG/ANTIGRAVITY_DEV/dixit-vs-impostor/data/words.json"
    with codecs.open(target_path, 'w', 'utf-8') as f:
        json.dump(final_data, f, ensure_ascii=False, indent=4)
    
    print("Diccionario recalibrado (Cultura Pop + Lugares Generales) sin números.")

if __name__ == "__main__":
    generate_better_words()
