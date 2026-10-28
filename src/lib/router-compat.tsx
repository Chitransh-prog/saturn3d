'use client';

import React, { forwardRef, useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter, usePathname, useParams as useNextParams } from 'next/navigation';

export interface LinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'className'> {
  to?: string;
  href?: string;
  replace?: boolean;
  state?: any;
  children?: React.ReactNode;
  className?: string | ((props: { isActive: boolean }) => string);
}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, href, className, children, ...props },
  ref
) {
  const target = to || href || '#';
  const pathname = usePathname();
  const isActive = pathname === target;

  const resolvedClassName = typeof className === 'function' ? className({ isActive }) : className;

  return (
    <NextLink ref={ref} href={target} className={resolvedClassName} {...props}>
      {children}
    </NextLink>
  );
});

export const NavLink = Link;

export function useNavigate() {
  const router = useRouter();
  return (to: string | number, options?: { replace?: boolean; state?: any }) => {
    if (typeof to === 'number') {
      if (typeof window !== 'undefined') {
        window.history.go(to);
      }
      return;
    }
    if (options?.replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  };
}

export function useLocation() {
  const pathname = usePathname();
  const [search, setSearch] = React.useState('');
  const [hash, setHash] = React.useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSearch(window.location.search || '');
      setHash(window.location.hash || '');
    }
  }, [pathname]);

  return {
    pathname: pathname || '/',
    search,
    hash,
    state: {} as any,
  };
}

export function useParams<T extends Record<string, string | string[]> = Record<string, string>>(): T {
  const params = useNextParams();
  return (params || {}) as T;
}

export function useSearchParams(): [URLSearchParams, (params: any) => void] {
  const router = useRouter();
  const pathname = usePathname();
  const [params, setParams] = React.useState<URLSearchParams>(() => new URLSearchParams());

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setParams(new URLSearchParams(window.location.search));
    }
  }, [pathname]);

  const setSearch = (newParams: Record<string, string>) => {
    const sp = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    Object.entries(newParams).forEach(([k, v]) => {
      if (v) sp.set(k, v);
      else sp.delete(k);
    });
    router.push(`${pathname}?${sp.toString()}`);
  };

  return [params, setSearch];
}

export function Navigate({ to, replace, state }: { to: string; replace?: boolean; state?: any }) {
  const router = useRouter();
  useEffect(() => {
    if (replace) {
      router.replace(to);
    } else {
      router.push(to);
    }
  }, [to, replace, router]);

  return null;
}

export function Routes({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function Route({ element }: { path?: string; element?: React.ReactNode }) {
  return <>{element}</>;
}

export function BrowserRouter({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export default {
  Link,
  NavLink,
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
  Navigate,
  Routes,
  Route,
  BrowserRouter,
};
