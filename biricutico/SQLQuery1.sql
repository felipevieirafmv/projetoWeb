INSERT INTO Salas (Nome, Capacidade, Setor, FotoSala, createdAt, updatedAt) VALUES ('Sala VIP Restaurante', 16, '204', '204/Ct204_SalaVIPRestaurante.png', GETDATE(), GETDATE());
INSERT INTO Pessoas (Usuario, Senha, Nome, createdAt, updatedAt) VALUES ('TAG1CT', 'ahnes', 'Tavares Guilherme (CtP/ETS)', GETDATE(), GETDATE());

select * from Pessoas

UPDATE Salas
SET Capacidade=2147483646, updatedAt=GETDATE()
WHERE Nome='Via Teams (on-line).'

ALTER TABLE Salas 
ADD FotoSala VARCHAR (255);