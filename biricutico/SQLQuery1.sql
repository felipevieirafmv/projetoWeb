INSERT INTO Salas (Nome, Capacidade, Setor, FotoSala, createdAt, updatedAt) VALUES ('Sala VIP Restaurante', 16, '204', '204/Ct204_SalaVIPRestaurante.png', GETDATE(), GETDATE());
INSERT INTO Pessoas (Usuario, Senha, Nome, createdAt, updatedAt) VALUES ('Teste4', 'Teste4', 'Teste4 a a a a a a a a a a a a', GETDATE(), GETDATE());

select * from Salas

UPDATE Salas
SET Capacidade=2147483646, updatedAt=GETDATE()
WHERE Nome='Via Teams (on-line).'

ALTER TABLE Salas 
ADD FotoSala VARCHAR (255);