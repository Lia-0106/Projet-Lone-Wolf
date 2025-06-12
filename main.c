#include "export_html.h"

int main(int argc, char *argv[])
{
    char filename[256];

    if (argc > 3) {
        printf("Trop d'arguments !");
        exit(EXIT_FAILURE);
    }
    
    if (argc < 3) {
        if (argc < 2 || strcmp(argv[1], "--file") != 0) {
            printf("Manque la Commande !\n");
        } else {
            printf("Manque le Fichier !\n");
        }
        exit(EXIT_FAILURE);
    } else {
        strcpy(filename, argv[2]);
    }

    start_section(filename);

    return EXIT_SUCCESS ;
}