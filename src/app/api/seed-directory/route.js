import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const COMPANIES = [
    {
        trade_name: 'Grupo Alteño',
        sector: 'Fabricación de dulces, paletas, gomitas y productos de confitería',
        address: 'Av. Manuel Ávila Camacho #1389, Col. Las Colonias, C.P. 47620, Tepatitlán de Morelos, Jalisco, México',
        phone: '+52 378 781 5530 / 378 781 5830 / 378 781 5820 / 378 781 2090',
        email: 'alteno@tepa.com.mx',
        website: 'http://www.alteno.com.mx',
        hours: 'Lun-Vie 9:00 - 18:00',
        municipality: 'Tepatitlán de Morelos',
        offer_description: 'Fabricación y distribución de dulces de alta calidad, paletas, gomitas y una amplia gama de productos de confitería con tradición alteña.',
        search_description: 'Nuevos canales de distribución, proveedores de materias primas para confitería, alianzas comerciales nacionales e internacionales.',
        is_verified: true
    },
    {
        trade_name: 'SISAY',
        sector: 'Productos de salud, suplementos y bienestar',
        address: 'Blvd. Anacleto González Flores Sur 1960, Col. Los Adobes, Tepatitlán de Morelos, Jalisco, México',
        phone: '378 701 6119 / 378 108 8107',
        email: 'sisaygemma@gmail.com',
        website: 'https://sisay.mx',
        hours: 'Lun–Vie 9:00 - 18:00',
        municipality: 'Tepatitlán de Morelos',
        offer_description: 'Suplementos alimenticios premium, productos de bienestar integral y soluciones de salud natural respaldadas por calidad.',
        search_description: 'Distribuidores autorizados, alianzas con gimnasios y centros de salud, clientes interesados en bienestar integral.',
        is_verified: true
    },
    {
        trade_name: 'Tequila Trujillo',
        sector: 'Producción y comercialización de Tequila Premium',
        address: 'Tepatitlán de Morelos, Jalisco, México',
        phone: '+52 33 3615 1515',
        email: 'contacto@tequilatrujillo.com',
        website: 'https://tequilatrujillo.com',
        hours: 'Lun-Vie 9:00 - 17:00',
        municipality: 'Tepatitlán de Morelos',
        offer_description: 'Tequila 100% de agave de calidad premium, producido con procesos tradicionales y selección rigurosa de agaves de los Altos de Jalisco.',
        search_description: 'Exportadores, distribuidores de bebidas espirituosas, sector restaurantero de alta gama y hotelería.',
        is_verified: true
    },
    {
        trade_name: 'UNID Tepatitlán',
        sector: 'Educación Superior, Licenciaturas y Posgrados',
        address: 'Av. Anacleto González Flores 875, Col. El Tablón, Tepatitlán de Morelos, Jalisco, México',
        phone: '378 781 8300',
        email: 'infottepa@unid.mx',
        website: 'https://unid.edu.mx',
        hours: 'Lun-Vie 8:00 - 20:00, Sab 9:00 - 14:00',
        municipality: 'Tepatitlán de Morelos',
        offer_description: 'Oferta educativa de vanguardia con licenciaturas, posgrados y diplomados enfocados en la empleabilidad y el desarrollo profesional.',
        search_description: 'Empresas para convenios de prácticas profesionales, egresados interesados en actualización, vinculación empresarial.',
        is_verified: true
    },
    {
        trade_name: 'Universidad Nueva Ciencia',
        sector: 'Educación, Investigación y Desarrollo Humano',
        address: 'Av. Matamoros 330, Centro, Tepatitlán de Morelos, Jalisco, México',
        phone: '378 782 5500',
        email: 'admisiones@nuevaciencia.edu.mx',
        website: 'https://nuevaciencia.edu.mx',
        hours: 'Lun-Vie 9:00 - 19:00',
        municipality: 'Tepatitlán de Morelos',
        offer_description: 'Institución educativa comprometida con la excelencia académica, la investigación científica y el desarrollo humano integral de sus estudiantes.',
        search_description: 'Investigadores, convenios académicos, prospectos para bachillerato y licenciaturas, alianzas estratégicas.',
        is_verified: true
    }
];

export async function GET() {
    try {
        const results = [];

        for (const company of COMPANIES) {
            const { data, error } = await supabaseAdmin
                .from('companies')
                .upsert(company, { onConflict: 'trade_name' })
                .select('id, trade_name')
                .single();

            if (error) {
                results.push({ name: company.trade_name, error: error.message });
            } else {
                results.push({ name: company.trade_name, id: data.id, status: 'upserted' });
            }
        }

        return NextResponse.json({ message: 'Directory seeded', results });
    } catch (err) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
