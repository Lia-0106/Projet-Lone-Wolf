CC = gcc
CFLAGS = -Wall -Wextra -O2
LDFLAGS = 

SRC = main.c utils.c
OBJ = $(SRC:.c=.o)
EXE = projet.exe

all: $(EXE)
$(EXE): $(OBJ)
	$(CC) $(OBJ) -o $(EXE) $(LDFLAGS)
%.o: %.c
	$(CC) $(CFLAGS) -c $< -o $@
web: $(EXE) 02fotw.data
	rm -f ./export/*.html
	./$(EXE) 02fotw.data
clean:
	rm -f $(OBJ) $(EXE)
