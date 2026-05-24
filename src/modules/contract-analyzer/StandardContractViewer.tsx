// src/modules/contract-analyzer/StandardContractViewer.tsx
// Visualiseur de contrat standard
// <130 lignes

'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

// Icônes
import { FileText, Download, Printer, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Bookmark, Share2 } from 'lucide-react';

interface StandardContractViewerProps {
  contractId?: number;
  contractContent?: string;
  contractUrl?: string;
  title?: string;
}

export const StandardContractViewer = ({ contractId, contractContent, contractUrl, title = 'Contrat' }: StandardContractViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages] = useState(5); // Simulation

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 10, 50));
  };

  const handleDownload = () => {
    if (contractUrl) {
      window.open(contractUrl, '_blank');
    } else {
      alert('Téléchargement du contrat...');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center flex-wrap gap-4">
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            {title}
            <span className="text-sm font-normal text-gray-500">#CON-{contractId || '0001'}</span>
          </CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
              <ZoomOut className="w-4 h-4" />
            </Button>
            <span className="text-sm text-gray-600 px-2">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
              <ZoomIn className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-1" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-1" />
              Imprimer
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Contenu du contrat */}
        <div 
          className="border rounded-lg p-6 bg-white min-h-[500px] overflow-auto"
          style={{ fontSize: `${zoom}%` }}
        >
          {contractContent ? (
            <div className="prose max-w-none">
              <p className="whitespace-pre-wrap">{contractContent}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">CONTRAT D'ASSURANCE</h2>
                <p className="text-gray-500">Entre les soussignés</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold">Article 1 - Objet du contrat</h3>
                <p className="text-sm text-gray-600">
                  Le présent contrat a pour objet de définir les conditions dans lesquelles l'Assureur garantit 
                  l'Assuré contre les risques décrits aux conditions particulières.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Article 2 - Durée</h3>
                <p className="text-sm text-gray-600">
                  Le contrat est conclu pour une durée d'un an, renouvelable par tacite reconduction.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Article 3 - Prime</h3>
                <p className="text-sm text-gray-600">
                  La prime annuelle est fixée à XXX €, payable en une fois ou fractionnable selon les options choisies.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Article 4 - Garanties</h3>
                <p className="text-sm text-gray-600">
                  L'Assureur garantit l'Assuré contre les conséquences pécuniaires des sinistres survenus pendant la période de garantie.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Article 5 - Exclusions</h3>
                <p className="text-sm text-gray-600">
                  Sont exclus de la garantie les dommages résultant d'une faute intentionnelle ou dolosive de l'Assuré.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4 pt-4 border-t">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Page précédente
            </Button>
            <span className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Page suivante
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}

        {/* Actions supplémentaires */}
        <div className="flex gap-2 mt-4 pt-4 border-t">
          <Button variant="ghost" size="sm">
            <Bookmark className="w-4 h-4 mr-1" />
            Marque-page
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4 mr-1" />
            Partager
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default StandardContractViewer;