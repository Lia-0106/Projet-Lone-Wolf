#include "export_html.h"

void start_section(char * filename)
{
    FILE * file = fopen(filename, "r");
    if (file == NULL) {
        printf("Unable to open file <%s>\n", filename), exit(EXIT_FAILURE);
    }

    char line[LINE_SIZE];
    FILE * write_file_html = NULL;
    int nbr_section;
    char file_html[256];

    while (fgets(line, sizeof(line), file)) {
        char * section = strstr(line, "<section>");
        if (section != NULL) {
            end_section(write_file_html);
            sscanf(line, "<section>sect%d", &nbr_section);
            sprintf(file_html, "./export/sect%d.html", nbr_section);

            write_file_html = fopen(file_html, "w");
            if (!write_file_html) {
                perror("Erreur ouverture fichier HTML");
                exit(1);
            }

            fprintf(write_file_html,
                "<!DOCTYPE html>\n"
                "<html>\n\t<head>\n"
                "\t\t<title>%s</title>\n"
                "\t\t<meta charset=\"utf-8\" />\n"
                "\t\t<link rel=\"stylesheet\" type=\"text/css\" href=\"style.css\">\n"
                "\t</head>\n\t<body>\n",
                file_html + 9);
        }

        if (write_file_html != NULL) {
            fprintf(write_file_html, "\t%s", line);
        }
    }

    end_section(write_file_html);
    fclose(write_file_html);

    fclose(file);
}

void end_section(FILE * write_file_html)
{
    if (write_file_html != NULL) {
        fprintf(write_file_html, "\t<script type=\"text/javascript\" src=\"javascript.js\"></script>"
                                 "\n\t</body>\n</html>\n");
        fclose(write_file_html);
        write_file_html = NULL;
    }
}

//Traiter un choice
//Trouver le nom de la section --> ouvrir celle choisie

