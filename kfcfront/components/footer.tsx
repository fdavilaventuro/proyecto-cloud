"use client"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-brand-red rounded-full flex items-center justify-center">
                <span className="text-white font-bold">KFC</span>
              </div>
              <span className="text-white font-bold">KFC Perú</span>
            </div>
            <p className="text-sm text-gray-400">El pollo frito más delicioso de Perú</p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Menú</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Combos
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Sándwiches
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Bebidas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Postres
                </a>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-white transition">
                  Sucursales
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition">
                  Trabaja con Nosotros
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contacto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="tel:+51123456789" className="hover:text-white transition">
                  +51 (1) 2345-6789
                </a>
              </li>
              <li>
                <a href="mailto:info@kfc.pe" className="hover:text-white transition">
                  info@kfc.pe
                </a>
              </li>
              <li className="pt-2">
                <span className="text-white font-semibold block mb-2">Síguenos:</span>
                <div className="flex gap-4">
                  <a href="#" className="hover:text-white transition">
                    Facebook
                  </a>
                  <a href="#" className="hover:text-white transition">
                    Instagram
                  </a>
                  <a href="#" className="hover:text-white transition">
                    Twitter
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2025 KFC Perú. Todos los derechos reservados.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-white transition">
                Términos y Condiciones
              </a>
              <a href="#" className="hover:text-white transition">
                Política de Privacidad
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
