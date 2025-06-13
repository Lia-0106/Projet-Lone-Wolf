#ifndef EXPORT_HTML_H
#define EXPORT_HTML_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define LINE_SIZE 2000

/**
 * @brief Lit les sections dans le fichier .data et génére un fichier HTML
 *
 * @param filename chemin d'accès vers le fichier .data
*/
void start_section(char * filename);

/**
 * @brief Ajoute la balise body et html en fin de fichier
 *
 * @param write_file_html pointeur sur un fichier HTML
*/
void end_section(FILE * write_file_html);

/**
 * @brief Cherche le nombre de la section et
 * modifie la balise <a> en y ajoutant un href pour link
 * sur les autres fichiers HTML
 *
 * @param line pointeur sur ligne
*/
void link(char * line);

#endif