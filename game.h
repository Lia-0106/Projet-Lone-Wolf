#ifndef GAME_H
#define GAME_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

typedef struct {
    char name[32];
    int endurance;
    int hability;
} Player;

int generate_rnt();
Player * player_generator(char name[256]);
void calcule_point(int rc, int nbr_rand, int* hero,int* enemi);

#endif