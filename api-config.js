/* BeeHouse API client - production-safe, never leaves the UI spinning forever. */
(function () {
  'use strict';

  // Same-origin Node.js is the recommended deployment.
  // For GitHub Pages + separate Node.js backend, set this to the backend origin.
  window.BEEHOUSE_API_BASE = window.BEEHOUSE_API_BASE || '';

  const base = String(window.BEEHOUSE_API_BASE || '').trim().replace(/\/+$/, '');
  const API_TIMEOUT = 4500;

  function apiUrl(path) {
    if (!path) return base || location.origin;
    if (/^https?:\/\//i.test(path)) return path;
    return (base || '') + (path.startsWith('/') ? path : '/' + path);
  }

  async function fetchApi(path, options = {}) {
    const headers = new Headers(options.headers || {});
    const isForm = options.body instanceof FormData;
    if (!isForm && !headers.has('Accept')) headers.set('Accept', 'application/json');
    if (!isForm && options.body != null && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), Number(options.timeout || API_TIMEOUT));
    const { timeout, signal, ...rest } = options;

    let response;
    try {
      response = await fetch(apiUrl(path), {
        ...rest,
        signal: signal || controller.signal,
        credentials: 'include',
        cache: 'no-store',
        headers
      });
    } catch (error) {
      if (error?.name === 'AbortError') {
        throw new Error('เชื่อมต่อเซิร์ฟเวอร์นานเกินไป กรุณาตรวจสอบ Node.js API');
      }
      throw new Error('ไม่สามารถเชื่อมต่อ Node.js API ได้');
    } finally {
      clearTimeout(timer);
    }

    const type = (response.headers.get('content-type') || '').toLowerCase();
    if (!type.includes('application/json')) {
      const text = await response.text().catch(() => '');
      if (/^\s*(<!doctype\s+html|<html[\s>])/i.test(text)) {
        throw new Error('API URL นี้ส่งหน้า HTML กลับมา ไม่ใช่ JSON — กรุณาชี้ BEEHOUSE_API_BASE ไปยัง Node.js Server');
      }
      throw new Error('Node.js API ส่งข้อมูลที่ไม่ใช่ JSON');
    }
    return response;
  }

  window.BeeHouseAPI = {
    base,
    timeout: API_TIMEOUT,
    url: apiUrl,
    fetch: fetchApi
  };
})();
