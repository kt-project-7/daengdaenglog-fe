import html2pdf from 'html2pdf.js'

export const saveAsPdf = (elementId: string, filename = '결과.pdf') => {
  const el = document.getElementById(elementId)
  if (!el) return

  html2pdf()
    .set({
      margin: 10,
      filename,
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    })
    .from(el)
    .save()
}

export const copyCurrentUrl = () => {
  navigator.clipboard
    .writeText(window.location.href)
    .then(() => {
      alert('URL이 클립보드에 복사되었습니다.')
    })
    .catch((err) => {
      console.error('URL 복사 실패:', err)
      alert('URL 복사에 실패했습니다.')
    })
}

export const shareToKakao = (
  title: string,
  description: string,
  imageUrl: string,
) => {
  if (!window.Kakao) {
    alert('카카오톡 SDK가 로드되지 않았습니다. 잠시 후 다시 시도해주세요.')
    return
  }

  if (!window.Kakao.isInitialized()) {
    window.Kakao.init(import.meta.env.VITE_KAKAO_JAVASCRIPT_KEY)
  }

  window.Kakao.Share.sendDefault({
    objectType: 'feed',
    content: {
      title,
      description,
      imageUrl,
      link: {
        mobileWebUrl: window.location.href,
        webUrl: window.location.href,
      },
    },
    buttons: [
      {
        title: '결과 확인하기',
        link: {
          mobileWebUrl: window.location.href,
          webUrl: window.location.href,
        },
      },
    ],
  })
}
