import { useState, useEffect, useCallback } from 'react';

export interface Certificate {
  id: string;
  studentName: string;
  courseName: string;
  completionDate: Date;
  issueDate: Date;
  certificateNumber: string;
  grade?: string;
  duration: string;
  instructor: string;
  skills: string[];
  validUntil?: Date;
  status: 'valid' | 'expired' | 'revoked';
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
}

export interface CertificationState {
  certificates: Certificate[];
  isLoading: boolean;
  error: string | null;
}

export const useCertification = () => {
  const [state, setState] = useState<CertificationState>({
    certificates: [],
    isLoading: false,
    error: null
  });

  // Load certificates from localStorage
  const loadCertificates = useCallback(() => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const stored = localStorage.getItem('jurus_certificates');
      if (stored) {
        const certificates = JSON.parse(stored).map((cert: any) => ({
          ...cert,
          completionDate: new Date(cert.completionDate),
          issueDate: new Date(cert.issueDate),
          validUntil: cert.validUntil ? new Date(cert.validUntil) : undefined
        }));
        
        setState(prev => ({ 
          ...prev, 
          certificates,
          isLoading: false 
        }));
      } else {
        // Initialize with sample certificates
        const sampleCertificates: Certificate[] = [
          {
            id: '1',
            studentName: 'João Silva',
            courseName: 'Fundamentos de Investimentos',
            completionDate: new Date('2024-01-15'),
            issueDate: new Date('2024-01-16'),
            certificateNumber: 'CERT-2024-001',
            grade: '9.5',
            duration: '40 horas',
            instructor: 'Maria Santos',
            skills: ['Análise de Investimentos', 'Gestão de Risco', 'Diversificação'],
            validUntil: new Date('2026-01-16'),
            status: 'valid',
            category: 'Investimentos',
            level: 'beginner'
          },
          {
            id: '2',
            studentName: 'Ana Costa',
            courseName: 'Planejamento de Aposentadoria',
            completionDate: new Date('2024-02-20'),
            issueDate: new Date('2024-02-21'),
            certificateNumber: 'CERT-2024-002',
            grade: '8.8',
            duration: '60 horas',
            instructor: 'Carlos Oliveira',
            skills: ['Planejamento Financeiro', 'Previdência', 'Cálculos Atuariais'],
            validUntil: new Date('2026-02-21'),
            status: 'valid',
            category: 'Aposentadoria',
            level: 'intermediate'
          },
          {
            id: '3',
            studentName: 'Pedro Almeida',
            courseName: 'Análise Técnica Avançada',
            completionDate: new Date('2023-12-10'),
            issueDate: new Date('2023-12-11'),
            certificateNumber: 'CERT-2023-045',
            grade: '9.2',
            duration: '80 horas',
            instructor: 'Roberto Lima',
            skills: ['Análise Técnica', 'Indicadores', 'Trading', 'Gestão de Risco'],
            validUntil: new Date('2025-12-11'),
            status: 'valid',
            category: 'Trading',
            level: 'advanced'
          }
        ];
        
        setState(prev => ({ 
          ...prev, 
          certificates: sampleCertificates,
          isLoading: false 
        }));
        
        saveCertificates(sampleCertificates);
      }
    } catch (error) {
      setState(prev => ({ 
        ...prev, 
        error: 'Erro ao carregar certificados',
        isLoading: false 
      }));
    }
  }, []);

  // Save certificates to localStorage
  const saveCertificates = useCallback((certificates: Certificate[]) => {
    try {
      localStorage.setItem('jurus_certificates', JSON.stringify(certificates));
    } catch (error) {
      console.error('Erro ao salvar certificados:', error);
    }
  }, []);

  // Generate a new certificate
  const generateCertificate = useCallback((certificateData: Omit<Certificate, 'id' | 'certificateNumber' | 'issueDate' | 'status'>) => {
    const newCertificate: Certificate = {
      ...certificateData,
      id: Date.now().toString(),
      certificateNumber: `CERT-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`,
      issueDate: new Date(),
      status: 'valid'
    };

    setState(prev => {
      const updatedCertificates = [...prev.certificates, newCertificate];
      saveCertificates(updatedCertificates);
      return {
        ...prev,
        certificates: updatedCertificates
      };
    });

    return newCertificate;
  }, [saveCertificates]);

  // Verify certificate by number
  const verifyCertificate = useCallback(async (certificateNumber: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const certificate = state.certificates.find(cert => cert.certificateNumber === certificateNumber);
    return certificate ? certificate.status === 'valid' : false;
  }, [state.certificates]);

  // Update certificate status
  const updateCertificateStatus = useCallback((certificateId: string, status: Certificate['status']) => {
    setState(prev => {
      const updatedCertificates = prev.certificates.map(cert =>
        cert.id === certificateId ? { ...cert, status } : cert
      );
      saveCertificates(updatedCertificates);
      return {
        ...prev,
        certificates: updatedCertificates
      };
    });
  }, [saveCertificates]);

  // Get certificates by status
  const getCertificatesByStatus = useCallback((status: Certificate['status']) => {
    return state.certificates.filter(cert => cert.status === status);
  }, [state.certificates]);

  // Get certificates by category
  const getCertificatesByCategory = useCallback((category: string) => {
    return state.certificates.filter(cert => cert.category === category);
  }, [state.certificates]);

  // Get certificates by level
  const getCertificatesByLevel = useCallback((level: Certificate['level']) => {
    return state.certificates.filter(cert => cert.level === level);
  }, [state.certificates]);

  // Get certificate statistics
  const getCertificateStats = useCallback(() => {
    const total = state.certificates.length;
    const valid = state.certificates.filter(cert => cert.status === 'valid').length;
    const expired = state.certificates.filter(cert => cert.status === 'expired').length;
    const revoked = state.certificates.filter(cert => cert.status === 'revoked').length;
    const withGrade = state.certificates.filter(cert => cert.grade).length;
    
    const categories = Array.from(new Set(state.certificates.map(cert => cert.category)));
    const levels = {
      beginner: state.certificates.filter(cert => cert.level === 'beginner').length,
      intermediate: state.certificates.filter(cert => cert.level === 'intermediate').length,
      advanced: state.certificates.filter(cert => cert.level === 'advanced').length
    };

    return {
      total,
      valid,
      expired,
      revoked,
      withGrade,
      categories: categories.length,
      levels
    };
  }, [state.certificates]);

  // Download certificate (simulate)
  const downloadCertificate = useCallback(async (certificate: Certificate) => {
    // Simulate download process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would generate and download a PDF
    console.log('Downloading certificate:', certificate.certificateNumber);
    
    // Create a blob URL for download simulation
    const content = `Certificado: ${certificate.courseName}\nAluno: ${certificate.studentName}\nNúmero: ${certificate.certificateNumber}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificado-${certificate.certificateNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, []);

  // Share certificate
  const shareCertificate = useCallback(async (certificate: Certificate) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Certificado - ${certificate.courseName}`,
          text: `Confira meu certificado de conclusão do curso "${certificate.courseName}"!`,
          url: `${window.location.origin}/certificado/${certificate.certificateNumber}`
        });
      } catch (error) {
        console.log('Erro ao compartilhar:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const shareText = `Confira meu certificado de conclusão do curso "${certificate.courseName}"! Número: ${certificate.certificateNumber}`;
      await navigator.clipboard.writeText(shareText);
      alert('Link copiado para a área de transferência!');
    }
  }, []);

  // Print certificate
  const printCertificate = useCallback((certificate: Certificate) => {
    // In a real implementation, this would open a print-friendly version
    window.print();
  }, []);

  // Send certificate by email
  const emailCertificate = useCallback((certificate: Certificate) => {
    const subject = encodeURIComponent(`Certificado - ${certificate.courseName}`);
    const body = encodeURIComponent(
      `Olá!\n\nSegue em anexo meu certificado de conclusão do curso "${certificate.courseName}".\n\nNúmero do certificado: ${certificate.certificateNumber}\nData de conclusão: ${certificate.completionDate.toLocaleDateString('pt-BR')}\n\nAtenciosamente,\n${certificate.studentName}`
    );
    
    window.open(`mailto:?subject=${subject}&body=${body}`);
  }, []);

  // Check for expired certificates
  const checkExpiredCertificates = useCallback(() => {
    const now = new Date();
    const expiredCertificates = state.certificates.filter(cert => 
      cert.validUntil && cert.validUntil < now && cert.status === 'valid'
    );
    
    if (expiredCertificates.length > 0) {
      expiredCertificates.forEach(cert => {
        updateCertificateStatus(cert.id, 'expired');
      });
    }
    
    return expiredCertificates;
  }, [state.certificates, updateCertificateStatus]);

  // Initialize
  useEffect(() => {
    loadCertificates();
  }, [loadCertificates]);

  // Check for expired certificates periodically
  useEffect(() => {
    const interval = setInterval(checkExpiredCertificates, 24 * 60 * 60 * 1000); // Check daily
    return () => clearInterval(interval);
  }, [checkExpiredCertificates]);

  return {
    // State
    certificates: state.certificates,
    isLoading: state.isLoading,
    error: state.error,
    
    // Actions
    generateCertificate,
    verifyCertificate,
    updateCertificateStatus,
    downloadCertificate,
    shareCertificate,
    printCertificate,
    emailCertificate,
    
    // Getters
    getCertificatesByStatus,
    getCertificatesByCategory,
    getCertificatesByLevel,
    getCertificateStats,
    
    // Utils
    loadCertificates,
    checkExpiredCertificates
  };
};