#ifndef EXPORT_HTML_H
#define EXPORT_HTML_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <math.h>

#define LINE_SIZE 2000

FILE * start_section(char * filename);
char * html_file_generator(int section_nbr);
void end_section(FILE * file);


#endif