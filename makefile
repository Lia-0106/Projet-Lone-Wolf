CC = gcc
CFLAGS = -Wall -Wextra -O2
LDFLAGS = 

SRC = main.c export_html.c fichier2.c
OBJ = $(SRC:.c=.o)
EXE = projet.exe

all: $(EXE)
$(EXE): $(OBJ)
	$(CC) $(OBJ) -o $(EXE) $(LDFLAGS)
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@
web:
	del /Q .\export\*.html
	./$(EXE) --file ./ressources/02fotw.data
hsup:
	del /Q .\export\*.html
clean:
	del /Q $(OBJ) $(EXE)
