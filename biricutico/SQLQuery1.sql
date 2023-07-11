INSERT INTO Salas (Nome, Capacidade, Setor, FotoSala, createdAt, updatedAt) VALUES ('Sala VIP Restaurante', 16, '204', '204/Ct204_SalaVIPRestaurante.png', GETDATE(), GETDATE());
INSERT INTO Pessoas (Usuario, Senha, Nome, createdAt, updatedAt) VALUES ('Teste4', 'Teste4', 'Teste4 a a a a a a a a a a a a', GETDATE(), GETDATE());
INSERT INTO Reuniaos (Assunto, HorarioInicio, HorarioFim, Observacoes, createdAt, updatedAt, IDSala) VALUES ('Reuniao teste2', '2023-07-10 12:00:00', '2023-07-10 13:00:00', 'Reuniao de teste2', GETDATE(), GETDATE(), 6)
INSERT INTO PessoaReuniaos (Responsavel, createdAt, updatedAt, Usuario, IdReuniao) VALUES (1, GETDATE(), GETDATE(), 'VIF1CT', 4)

select * from PessoaReuniaos

UPDATE Salas
SET Capacidade=2147483646, updatedAt=GETDATE()
WHERE Nome='Via Teams (on-line).'

ALTER TABLE Salas 
ADD FotoSala VARCHAR (255);

select * from Pessoas P
inner join PessoaReuniaos PR
	on P.Usuario = PR.Usuario
inner join Reuniaos R
	on R.IdReuniao = PR.IdReuniao
where p.Usuario = 'VIF1CT'

DELETE FROM PessoaReuniaos
WHERE IdPessoaReuniao = 3