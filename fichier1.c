#include "fichier1.h"

//Lire le fichier section HTML
FILE * start_section(char * section_name, char * filename){
    FILE * file = fopen(filename, 'r');
    if (file == NULL) {
        printf("Unable to open file <%s>\n", filename), exit(EXIT_FAILURE);
    }

    char line[LINE_SIZE];
    while (fgets(line, sizeof(line), file)) {

        if (strstr(line,))
        {
            /* code */
        }
        
        if (condition)//fin section
        {
            break;
        }
        
        
    }
    
    return file;
}

void html_file_generator(int section_nbr)
{
    char command_line[256];
    system("cd export");
    sprintf(command_line, "touch sect%d.html", section_nbr);
    system(command_line);
}

//Fermer le fichier
void end_section(FILE * file)
{
    // html_file_generator();
    fclose(file);
}

//Traiter un choice