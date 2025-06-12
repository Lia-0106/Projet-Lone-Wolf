#ifndef FICHIER1_H
#define FICHIER1_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#define LINE_SIZE 2000 //taille d'une ligne

FILE * start_section(char * section_name, char * filename);
void html_file_generator(int section_nbr);
void end_section(FILE * file);


#endif