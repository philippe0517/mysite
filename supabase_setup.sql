-- ============================================================
-- 个人主页 V3 - Supabase 后台初始化脚本
-- 用法：在 Supabase 项目的 SQL Editor 中一次性执行
-- ============================================================

-- 1. 启用 uuid 扩展（如果尚未启用）
create extension if not exists "uuid-ossp";

-- 2. 创建 feedback 表
create table if not exists public.feedback (
  id uuid primary key default uuid_generate_v4(),
  name text,                              -- 昵称（可选）
  relation text,                          -- 关系：同学/老师/家人/朋友/同事/其他/不便透露
  device text,                            -- 设备：电脑/手机/平板/其他
  message text not null,                  -- 反馈内容（必填）
  version text default 'V3',              -- 网站版本
  created_at timestamptz default now()   -- 提交时间
);

-- 3. 开启 RLS 行级安全
alter table public.feedback enable row level security;

-- 3.5 授予基本权限（RLS 开启后必须先授权，策略才能生效）
grant insert on public.feedback to anon;
grant select, insert, update, delete on public.feedback to authenticated;

-- 4. 策略：允许匿名访客提交反馈（INSERT）
drop policy if exists "允许访客提交反馈" on public.feedback;
create policy "允许访客提交反馈"
  on public.feedback
  for insert
  to anon
  with check (true);

-- 5. 策略：已登录用户（你自己）可以读取全部反馈
drop policy if exists "主人可读取反馈" on public.feedback;
create policy "主人可读取反馈"
  on public.feedback
  for select
  to authenticated
  using (true);

-- 6. 策略：已登录用户可以更新和删除反馈
drop policy if exists "主人可更新反馈" on public.feedback;
create policy "主人可更新反馈"
  on public.feedback
  for update
  to authenticated
  using (true);

drop policy if exists "主人可删除反馈" on public.feedback;
create policy "主人可删除反馈"
  on public.feedback
  for delete
  to authenticated
  using (true);

-- 7. 验证：查看表结构
-- select * from information_schema.columns where table_name = 'feedback' order by ordinal_position;

-- 8. 验证：查看RLS策略
-- select * from pg_policies where tablename = 'feedback';
