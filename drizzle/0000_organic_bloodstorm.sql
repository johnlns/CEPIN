CREATE TABLE `alunos` (
	`id` text PRIMARY KEY NOT NULL,
	`full_name` text NOT NULL,
	`birthdate` text NOT NULL,
	`notes` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `alunos_saude` (
	`aluno_id` text PRIMARY KEY NOT NULL,
	`possui_problema` integer DEFAULT false NOT NULL,
	`laudo` text,
	`apoio_especial` text,
	`alergias` text,
	`convenio` text,
	`tipo_sanguineo` text,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `atendimentos` (
	`id` text PRIMARY KEY NOT NULL,
	`profissional_id` text NOT NULL,
	`paciente_id` text NOT NULL,
	`data` text NOT NULL,
	`valor_sessao_cents` integer NOT NULL,
	`tipo_pagamento` text NOT NULL,
	`status` text DEFAULT 'agendado' NOT NULL,
	`observacoes` text,
	`criado_em` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`profissional_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`paciente_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `autorizados_retirada` (
	`id` text PRIMARY KEY NOT NULL,
	`aluno_id` text NOT NULL,
	`nome` text NOT NULL,
	`parentesco` text NOT NULL,
	`telefone` text NOT NULL,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `boletim_caixa` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`descricao` text NOT NULL,
	`categoria` text NOT NULL,
	`subcategoria` text NOT NULL,
	`origem` text NOT NULL,
	`valor_cents` integer NOT NULL,
	`forma` text NOT NULL,
	`documento_ref` text,
	`usuario_id` text,
	`criado_em` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `boletim_caixa_detalhado` (
	`id` text PRIMARY KEY NOT NULL,
	`data` text NOT NULL,
	`evento` text NOT NULL,
	`referencia` text,
	`tipo_movimento` text NOT NULL,
	`valor_cents` integer NOT NULL,
	`observacoes` text,
	`usuario_id` text,
	`criado_em` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`usuario_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `campanhas_precos` (
	`id` text PRIMARY KEY NOT NULL,
	`plano_id` text NOT NULL,
	`nome_campanha` text NOT NULL,
	`regra_json` text NOT NULL,
	`vigente_de` text NOT NULL,
	`vigente_ate` text NOT NULL,
	FOREIGN KEY (`plano_id`) REFERENCES `planos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `cobrancas` (
	`id` text PRIMARY KEY NOT NULL,
	`aluno_id` text NOT NULL,
	`referencia` text NOT NULL,
	`origem` text NOT NULL,
	`valor_cents` integer NOT NULL,
	`status` text DEFAULT 'pendente' NOT NULL,
	`mp_preference_id` text,
	`mp_payment_id` text,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`paid_at` integer,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `contratos` (
	`id` text PRIMARY KEY NOT NULL,
	`aluno_id` text NOT NULL,
	`responsavel_id` text NOT NULL,
	`tipo` text NOT NULL,
	`pdf_url` text,
	`aceite_em` integer,
	`ip_aceite` text,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`responsavel_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `despesas_fixas` (
	`id` text PRIMARY KEY NOT NULL,
	`nome` text NOT NULL,
	`categoria` text NOT NULL,
	`valor_padrao_cents` integer NOT NULL,
	`vencimento_dia` integer NOT NULL,
	`ativo` integer DEFAULT true NOT NULL,
	`observacoes` text
);
--> statement-breakpoint
CREATE TABLE `despesas_fixas_mensal` (
	`id` text PRIMARY KEY NOT NULL,
	`referencia_mes` text NOT NULL,
	`despesa_id` text NOT NULL,
	`valor_cents` integer NOT NULL,
	`vencimento` text NOT NULL,
	`status` text DEFAULT 'aberto' NOT NULL,
	`pago_em` integer,
	`observacoes` text,
	FOREIGN KEY (`despesa_id`) REFERENCES `despesas_fixas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `email_otps` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`code_hash` text NOT NULL,
	`attempts` integer DEFAULT 0 NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `matriculas` (
	`id` text PRIMARY KEY NOT NULL,
	`turma_id` text NOT NULL,
	`aluno_id` text NOT NULL,
	`status` text DEFAULT 'ativa' NOT NULL,
	`started_at` text NOT NULL,
	FOREIGN KEY (`turma_id`) REFERENCES `turmas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `pacote_consumos` (
	`id` text PRIMARY KEY NOT NULL,
	`venda_id` text NOT NULL,
	`aluno_id` text NOT NULL,
	`data_uso` text NOT NULL,
	`turma_id` text,
	`observacao` text,
	FOREIGN KEY (`venda_id`) REFERENCES `vendas_avulsas`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`turma_id`) REFERENCES `turmas`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `personal_agendas` (
	`id` text PRIMARY KEY NOT NULL,
	`profissional_id` text NOT NULL,
	`aluno_id` text NOT NULL,
	`data` text NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	`status` text DEFAULT 'agendado' NOT NULL,
	`valor_cents` integer NOT NULL,
	`pagador` text NOT NULL,
	`observacoes` text,
	FOREIGN KEY (`profissional_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `personal_fechamento_itens` (
	`fechamento_id` text NOT NULL,
	`agenda_id` text NOT NULL,
	`valor_cents` integer NOT NULL,
	PRIMARY KEY(`fechamento_id`, `agenda_id`),
	FOREIGN KEY (`fechamento_id`) REFERENCES `personal_fechamentos`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`agenda_id`) REFERENCES `personal_agendas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `personal_fechamentos` (
	`id` text PRIMARY KEY NOT NULL,
	`referencia_mes` text NOT NULL,
	`pagador` text NOT NULL,
	`total_sessoes` integer NOT NULL,
	`valor_total_cents` integer NOT NULL,
	`status` text DEFAULT 'aberto' NOT NULL,
	`recibo_url` text
);
--> statement-breakpoint
CREATE TABLE `planos` (
	`id` text PRIMARY KEY NOT NULL,
	`tipo` text NOT NULL,
	`nome` text NOT NULL,
	`descricao` text,
	`valor_cents` integer NOT NULL,
	`periodicidade` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `receitas_mensais` (
	`id` text PRIMARY KEY NOT NULL,
	`referencia_mes` text NOT NULL,
	`categoria` text NOT NULL,
	`valor_cents` integer NOT NULL,
	`observacoes` text,
	`criado_em` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`token` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `turma_horarios` (
	`id` text PRIMARY KEY NOT NULL,
	`turma_id` text NOT NULL,
	`weekday` integer NOT NULL,
	`start_time` text NOT NULL,
	`end_time` text NOT NULL,
	FOREIGN KEY (`turma_id`) REFERENCES `turmas`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `turmas` (
	`id` text PRIMARY KEY NOT NULL,
	`esporte` text NOT NULL,
	`nome` text NOT NULL,
	`faixa_etaria` text NOT NULL,
	`capacidade` integer NOT NULL,
	`professor_id` text NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`professor_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'responsavel' NOT NULL,
	`created_at` integer DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vendas_avulsas` (
	`id` text PRIMARY KEY NOT NULL,
	`aluno_id` text NOT NULL,
	`tipo` text NOT NULL,
	`referencia` text NOT NULL,
	`quantidade` integer NOT NULL,
	`valor_unit_cents` integer NOT NULL,
	`valor_total_cents` integer NOT NULL,
	`data` text NOT NULL,
	`status` text DEFAULT 'pendente' NOT NULL,
	`observacoes` text,
	FOREIGN KEY (`aluno_id`) REFERENCES `alunos`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);