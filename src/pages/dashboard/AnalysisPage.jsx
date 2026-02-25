// Add these imports at the top
import { useToast } from '../../context/ToastContext';
import { AnalysisSkeleton } from '../../components/common/Skeleton';

// Inside the component
const { toast } = useToast();

const handleGenerate = async () => {
  setLoading(true);
  setError('');
  setAnalysis(null);
  toast('AI analysis started...', 'info');
  try {
    const res = await analysisApi.generate(sendSms);
    const parsed = res.data.data.analysis;
    setAnalysis(parsed);
    loadHistory();
    toast('Analysis generated successfully!', 'success');
  } catch (err) {
    const msg = err.response?.data?.message || 'Failed to generate analysis.';
    setError(msg);
    toast(msg, 'error');
  } finally {
    setLoading(false);
  }
};

// Replace the loading spinner with:
{loading && <AnalysisSkeleton />}